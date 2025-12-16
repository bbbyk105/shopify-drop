import { NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimit } from "@/lib/rateLimit";
import { shopifyAdminFetch } from "@/lib/shopifyAdmin";
import type {
  TrackingLookupRequest,
  TrackingLookupResponse,
} from "@/types/tracking";

const trackingSchema = z.object({
  orderNumber: z
    .string()
    .min(1, "Order number is required")
    .max(50, "Order number must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim()
    .toLowerCase(),
});

const TRACKING_QUERY = `
  query OrderLookup($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          name
          processedAt
          displayFulfillmentStatus
          fulfillments(first: 5) {
            status
            trackingInfo {
              number
              company
              url
            }
          }
        }
      }
    }
  }
`;

const normalizeOrderNumber = (orderNumber: string) => {
  const trimmed = orderNumber.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
};

export async function POST(
  request: Request
): Promise<NextResponse<TrackingLookupResponse | { message: string }>> {
  try {
    const body = (await request.json()) as TrackingLookupRequest;

    // Zodバリデーション
    const validationResult = trackingSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { message: errors[0] || "Validation failed" },
        { status: 400 }
      );
    }

    const orderNumber = normalizeOrderNumber(validationResult.data.orderNumber);
    const email = validationResult.data.email;

    const ip = getClientIp(request);
    const rate = checkRateLimit(`tracking:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: rate.retryAfter
            ? { "Retry-After": Math.ceil(rate.retryAfter / 1000).toString() }
            : undefined,
        }
      );
    }

    const queryString = `name:${orderNumber} email:${email}`;

    const data = await shopifyAdminFetch<{
      orders: {
        edges: Array<{
          node: {
            name: string;
            processedAt: string;
            displayFulfillmentStatus: string;
            fulfillments: Array<{
              status: string;
              trackingInfo: Array<{
                number: string;
                company: string | null;
                url: string | null;
              }>;
            }>;
          };
        }>;
      };
    }>(TRACKING_QUERY, { query: queryString });

    const orderNode = data.orders?.edges?.[0]?.node;
    if (!orderNode) {
      return NextResponse.json({ found: false });
    }

    const responseBody: TrackingLookupResponse = {
      found: true,
      order: {
        name: orderNode.name,
        processedAt: orderNode.processedAt,
        fulfillmentStatus: orderNode.displayFulfillmentStatus,
      },
      fulfillments:
        orderNode.fulfillments?.map((f) => ({
          status: f.status,
          tracking: (f.trackingInfo || []).map((t) => ({
            number: t.number,
            company: t.company,
            url: t.url,
          })),
        })) ?? [],
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Tracking lookup error", error);
    return NextResponse.json(
      { message: "Failed to search. Please try again later." },
      { status: 500 }
    );
  }
}


