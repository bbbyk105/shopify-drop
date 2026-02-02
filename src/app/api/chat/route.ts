import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rateLimit";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
// RAG: OPENAI_VECTOR_STORE_ID が設定されている場合は Assistants API + file_search で根拠を取得し sources に URL を詰める拡張が可能

const MAX_TOTAL_CHARS = 8000; // Limit total message length to prevent abuse
const RATE_LIMIT_REQUESTS_PER_MINUTE = 20;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  context: z
    .object({
      currentUrl: z.string().url().optional(),
      locale: z.string().optional(),
    })
    .optional(),
});

const CONTACT_URL = "https://evimeriahome.com/contact";
const HANDOFF_CONTACT_LINE =
  "A support agent will review this. Please contact us here: " + CONTACT_URL;

// Handoff only when needed: policy disputes, damage/missing, billing, refund/cancel disputes, warranty, legal, or receipt/invoice reissue.
const HANDOFF_PHRASES = [
  "damaged",
  "broken",
  "defective",
  "missing package",
  "not received",
  "didn't receive",
  "never received",
  "billing",
  "charge",
  "charged",
  "refund dispute",
  "refund request",
  "cancel my order",
  "cancel order",
  "cancellation",
  "warranty",
  "legal",
  "lawyer",
  "sue",
  "reissue",
  "resend",
  "send again",
  "missing email",
  "didn't get the email",
];
// Receipt/invoice: only handoff if user clearly needs reissue or didn't receive email.
const RECEIPT_HANDOFF_PHRASES = [
  "didn't receive",
  "not received",
  "missing email",
  "reissue",
  "resend",
  "send again",
];

function shouldHandoff(lastUserContent: string): boolean {
  const normalized = lastUserContent.trim().toLowerCase();
  const hasReceiptInvoice =
    /\b(receipt|invoice)\b/i.test(normalized) &&
    RECEIPT_HANDOFF_PHRASES.some((p) => normalized.includes(p));
  if (hasReceiptInvoice) return true;
  return HANDOFF_PHRASES.some((p) => normalized.includes(p.toLowerCase()));
}

const SYSTEM_INSTRUCTIONS = `You are Evimeria Home's customer support assistant for a furniture e-commerce store.
Always respond in English, even if the user writes in Japanese.
Use a clear, helpful tone. Do not use emojis.

CRITICAL RULES
- Never invent facts or make definitive claims without a confirmed policy/product detail.
- For policy questions, follow the canonical rules below and include the relevant link.
- If the situation needs a human review (damage, missing package, billing dispute, refund dispute, cancellation dispute, warranty, or receipt/invoice missing/reissue), tell the user you will escalate and direct them to Contact. End your reply with [HANDOFF] in that case.

CANONICAL POLICY FACTS (must follow exactly)
- Shipping destination: United States only.
- Shipping cost: Free shipping on all orders.
- Delivery estimate: 1–14 business days, depending on the product and logistics.
- Tracking: Tracking numbers are generally provided; tracking updates may take time or be temporarily unavailable.
- Cancellations: Only before shipment (before fulfillment processing begins). No cancellation after shipment/in transit/delivered.
- Returns & refunds: Refund support only if the customer contacts within 7 days after delivery.
  Refunds only (no replacements/reshipments). Photo verification may be required.
  No refunds for customer preference (changed mind, looks different, doesn't fit).
  Refunds go to the original payment method; timing depends on the provider/issuer.
- Payments: Credit cards and PayPal.
- Receipts/Invoices: Automatically emailed at purchase to the registered email address.
  Contact support ONLY if the email was not received or a reissue is needed.
- Privacy: Payment details are generally not stored by Evimeria Home and may be processed by third-party providers.
  Analytics/ads tools may include Google Analytics and Meta Ads.

LINKS
- Tracking: https://evimeriahome.com/tracking
- Contact: https://evimeriahome.com/contact
- Privacy Policy: https://evimeriahome.com/privacy-policy
- Cancellation Policy: https://evimeriahome.com/cancellation-policy
- Terms of Service: https://evimeriahome.com/terms-of-service

ANSWER STYLE
- Start with a direct answer in 1–2 sentences.
- Add brief details or next steps.
- When including links, use plain URLs only (e.g. https://evimeriahome.com/tracking). Do not use markdown link syntax like [this link](url).
- Ask up to 2 clarifying questions if needed.`;

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const rate = checkRateLimit(
      `chat:${ip}`,
      RATE_LIMIT_REQUESTS_PER_MINUTE,
      60_000
    );
    if (!rate.allowed) {
      return NextResponse.json(
        {
          reply: "Too many requests. Please try again in a moment.",
          handoff: true,
          sources: [],
        },
        {
          status: 429,
          headers: rate.retryAfter
            ? { "Retry-After": String(Math.ceil(rate.retryAfter / 1000)) }
            : undefined,
        }
      );
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          reply: "Please check your input and try again.",
          handoff: false,
          sources: [],
        },
        { status: 400 }
      );
    }

    const { messages, context } = parsed.data;
    const totalChars = messages.reduce(
      (sum, m) => sum + (m.content?.length ?? 0),
      0
    );
    if (totalChars > MAX_TOTAL_CHARS) {
      return NextResponse.json(
        {
          reply: "Message is too long. Please shorten it and try again.",
          handoff: false,
          sources: [],
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          reply: "Chat is temporarily unavailable. Please try again later.",
          handoff: true,
          sources: [],
        },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    const userHandoff = lastUserMessage
      ? shouldHandoff(lastUserMessage.content)
      : false;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_INSTRUCTIONS },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: openaiMessages,
      max_tokens: 1024,
      temperature: 0.6,
    });

    const rawContent = completion.choices[0]?.message?.content?.trim() ?? "";
    const hasHandoffMarker = rawContent.includes("[HANDOFF]");
    let reply =
      rawContent.replace(/\s*\[HANDOFF\]\s*$/i, "").trim() ||
      "Something went wrong. Please try again.";
    const handoff = userHandoff || hasHandoffMarker;

    if (handoff && !reply.includes(CONTACT_URL)) {
      reply = reply.trimEnd() + "\n\n" + HANDOFF_CONTACT_LINE;
    }

    const sources: { title: string; url: string }[] = [];
    if (handoff) {
      sources.push({ title: "Contact", url: "/contact" });
    }

    return NextResponse.json({
      reply,
      handoff,
      sources,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Something went wrong. Please try again.",
        handoff: true,
        sources: [{ title: "Contact", url: "/contact" }],
      },
      { status: 500 }
    );
  }
}
