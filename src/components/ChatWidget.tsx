"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CHAT_STORAGE_KEY = "evimeria-chat";
const MAX_STORED_MESSAGES = 50;
const CHAT_TTL_MS = 30 * 60 * 1000; // 30 minutes

type Message = { role: "user" | "assistant"; content: string };
type Source = { title: string; url: string };

function loadStoredChat(): {
  messages: Message[];
  handoff: boolean;
  sources: Source[];
} {
  if (typeof window === "undefined")
    return { messages: [], handoff: false, sources: [] };
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return { messages: [], handoff: false, sources: [] };
    const data = JSON.parse(raw) as {
      messages?: Message[];
      handoff?: boolean;
      sources?: Source[];
      savedAt?: number;
    };
    const savedAt = typeof data.savedAt === "number" ? data.savedAt : 0;
    if (!savedAt || Date.now() - savedAt > CHAT_TTL_MS) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return { messages: [], handoff: false, sources: [] };
    }
    const messages = Array.isArray(data.messages)
      ? data.messages.slice(-MAX_STORED_MESSAGES)
      : [];
    return {
      messages,
      handoff: Boolean(data.handoff),
      sources: Array.isArray(data.sources) ? data.sources : [],
    };
  } catch {
    return { messages: [], handoff: false, sources: [] };
  }
}

function saveStoredChat(
  messages: Message[],
  handoff: boolean,
  sources: Source[],
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        messages: messages.slice(-MAX_STORED_MESSAGES),
        handoff,
        sources,
        savedAt: Date.now(),
      }),
    );
  } catch {
    // ignore
  }
}

function clearStoredChat() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Trim trailing punctuation that might be sentence-ending (not part of the URL).
function trimUrlTrailingPunctuation(url: string): string {
  return url.replace(/[.,;:!?)\]]+$/, "");
}

// Renders content with clickable URLs; converts [text](url) to link (show URL if text is "this link").
function renderMessageContent(content: string) {
  const parts: React.ReactNode[] = [];
  const urlRe = /https?:\/\/[^\s<>"]+/g;
  const mdLinkRe = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  let s = content;
  // Replace markdown [text](url) with a placeholder so we don't double-link; then linkify bare URLs.
  const mdMatches = [...s.matchAll(mdLinkRe)];
  if (mdMatches.length > 0) {
    mdMatches.forEach((m) => {
      const full = m[0];
      const text = m[1];
      const url = trimUrlTrailingPunctuation(m[2]);
      const i = s.indexOf(full, lastIndex);
      if (i > lastIndex) {
        parts.push(<span key={parts.length}>{s.slice(lastIndex, i)}</span>);
      }
      const linkText =
        !text || text.toLowerCase().trim() === "this link" ? url : text;
      parts.push(
        <a
          key={parts.length}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary hover:no-underline"
        >
          {linkText}
        </a>,
      );
      lastIndex = i + full.length;
    });
    if (lastIndex < s.length)
      parts.push(<span key={parts.length}>{s.slice(lastIndex)}</span>);
  } else {
    // No markdown links; linkify bare URLs (trim trailing punctuation)
    const matches = [...s.matchAll(urlRe)];
    matches.forEach((m) => {
      const raw = m[0];
      const url = trimUrlTrailingPunctuation(raw);
      const i = m.index ?? 0;
      if (i > lastIndex) {
        parts.push(<span key={parts.length}>{s.slice(lastIndex, i)}</span>);
      }
      parts.push(
        <a
          key={parts.length}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary hover:no-underline"
        >
          {url}
        </a>,
      );
      lastIndex = i + raw.length;
    });
    if (lastIndex < s.length)
      parts.push(<span key={parts.length}>{s.slice(lastIndex)}</span>);
  }
  if (parts.length === 0) return content;
  return <>{parts}</>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [typewriterLength, setTypewriterLength] = useState(0);
  const typewriterTargetRef = useRef<number>(0);
  const typewriterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const animateNextAssistantRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Typewriter: animate the last assistant message character by character (only when we just received a reply).
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || last.content.length === 0) {
      setTypewriterLength(0);
      return;
    }
    const target = last.content.length;
    if (typewriterTargetRef.current !== target) {
      typewriterTargetRef.current = target;
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
      if (animateNextAssistantRef.current) {
        animateNextAssistantRef.current = false;
        setTypewriterLength(0);
        const delayMs = 20;
        typewriterIntervalRef.current = setInterval(() => {
          setTypewriterLength((prev) => {
            if (prev >= target) {
              if (typewriterIntervalRef.current) {
                clearInterval(typewriterIntervalRef.current);
                typewriterIntervalRef.current = null;
              }
              return target;
            }
            return prev + 1;
          });
        }, delayMs);
      } else {
        setTypewriterLength(target);
      }
    }
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
    };
  }, [messages]);

  useEffect(() => {
    const { messages: m, handoff: h, sources: s } = loadStoredChat();
    setMessages(m);
    setHandoff(h);
    setSources(s);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveStoredChat(messages, handoff, sources);
  }, [hasHydrated, messages, handoff, sources]);

  const handleCloseChat = () => {
    clearStoredChat();
    setMessages([]);
    setHandoff(false);
    setSources([]);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseChat();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages, typewriterLength, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextUser: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, nextUser]);
    setInput("");
    setLoading(true);
    setHandoff(false);
    setSources([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, nextUser].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            currentUrl:
              typeof window !== "undefined" ? window.location.href : "",
            locale: "en-US",
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply ?? "Something went wrong. Please try again.";
      animateNextAssistantRef.current = true;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setHandoff(!!data.handoff);
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
      setHandoff(true);
      setSources([{ title: "Contact", url: "/contact" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
  };

  if (isMobile) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {open && (
          <div
            className={cn(
              "flex w-[min(100vw-2rem,380px)] flex-col rounded-lg border border-border bg-background shadow-lg",
              "max-h-[min(70vh,520px)]",
            )}
            aria-label="Chat"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-medium">Evimeria Support</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCloseChat}
                aria-label="Close chat"
              >
                <span className="sr-only">Close</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[320px]"
            >
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ask about shipping, cancellations, and refunds.
                </p>
              )}
              {messages.map((m, i) => {
                const isLastAssistant =
                  i === messages.length - 1 && m.role === "assistant";
                const displayContent = isLastAssistant
                  ? m.content.slice(0, typewriterLength)
                  : m.content;
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg text-sm",
                      m.role === "user"
                        ? "ml-auto w-fit max-w-[85%] bg-primary text-primary-foreground px-1.5 py-0.5"
                        : "mr-auto max-w-[85%] bg-muted text-foreground px-3 py-2",
                    )}
                  >
                    <span className="whitespace-pre-wrap break-words">
                      {renderMessageContent(displayContent)}
                    </span>
                    {isLastAssistant && typewriterLength < m.content.length && (
                      <span
                        className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse align-middle"
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}
              {loading && (
                <div className="mr-auto rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              )}
              {handoff && sources.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                  <p className="font-medium text-foreground mb-1">
                    A support agent will review this. Please contact us here:
                  </p>
                  <p className="text-muted-foreground mb-2 sr-only">
                    Contact links below.
                  </p>
                  <ul className="space-y-1">
                    {sources.map((s, i) => (
                      <li key={i}>
                        <Link
                          href={s.url}
                          className="text-primary underline hover:no-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-border p-3"
            >
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  maxLength={2000}
                  className="flex-1"
                  aria-label="Message input"
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  size="default"
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        )}

        <Button
          type="button"
          size="lg"
          className="h-12 w-12 rounded-full shadow-md"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
        >
          <span className="sr-only">{open ? "Close chat" : "Need help?"}</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </>
            )}
          </svg>
        </Button>
      </div>
    </>
  );
}
