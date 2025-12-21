"use client";

import { useState } from "react";
import { z } from "zod";
import type { TrackingLookupResponse } from "@/types/tracking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const trackingSchema = z.object({
  orderNumber: z
    .string()
    .min(1, "Order number is required")
    .max(50, "Order number must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type FormErrors = {
  orderNumber?: string;
  email?: string;
};

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingLookupResponse | null>(null);

  const validateForm = (): boolean => {
    const result = trackingSchema.safeParse({ orderNumber, email });
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (field) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/tracking/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = (await response.json()) as TrackingLookupResponse & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data?.message || "Search failed.");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Search failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderNumber(e.target.value);
    if (errors.orderNumber) {
      setErrors((prev) => ({ ...prev, orderNumber: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Order Tracking</h1>
        <p className="text-muted-foreground mb-8">
          Enter your order number (e.g. #1001 or 1001) and the email used at
          checkout.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-card p-6 shadow-sm mb-6"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Order number
            </label>
            <Input
              type="text"
              value={orderNumber}
              onChange={handleOrderNumberChange}
              placeholder="#1001 or 1001"
              className={errors.orderNumber ? "border-destructive" : ""}
              aria-invalid={!!errors.orderNumber}
              aria-describedby={
                errors.orderNumber ? "orderNumber-error" : undefined
              }
            />
            {errors.orderNumber && (
              <p
                id="orderNumber-error"
                className="mt-1 text-sm text-destructive"
              >
                {errors.orderNumber}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              className={errors.email ? "border-destructive" : ""}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Searching..." : "Check tracking"}
          </Button>
        </form>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
            {error}
          </div>
        )}

        {result && !result.found && (
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground mb-6">
            We couldn&apos;t find an order matching those details. Please
            double-check and try again.
          </div>
        )}

        {result && result.found && (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 space-y-1">
              <h2 className="text-lg font-semibold">Order details</h2>
              <p className="text-sm text-muted-foreground">
                Order: {result.order.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {result.order.fulfillmentStatus}
              </p>
              <p className="text-sm text-muted-foreground">
                Placed at:{" "}
                {new Date(result.order.processedAt).toLocaleString("en-US")}
              </p>
            </div>

            <div className="space-y-4">
              {result.fulfillments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Tracking info is not yet available.
                </p>
              )}

              {result.fulfillments.map((fulfillment, index) => (
                <div
                  key={`${fulfillment.status}-${index}`}
                  className="rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <p className="text-sm font-medium mb-2">
                    Fulfillment: {fulfillment.status}
                  </p>

                  {fulfillment.tracking.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Tracking number is not yet available.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {fulfillment.tracking.map((tracking) => (
                        <li
                          key={tracking.number}
                          className="flex flex-col gap-1 rounded border border-border bg-background p-3 text-sm"
                        >
                          <span className="font-medium">
                            Number: {tracking.number}
                          </span>
                          {tracking.company && (
                            <span className="text-muted-foreground">
                              Carrier: {tracking.company}
                            </span>
                          )}
                          {tracking.url && (
                            <a
                              href={tracking.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline hover:text-primary/80"
                            >
                              Track Package
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
