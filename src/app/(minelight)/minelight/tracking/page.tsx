"use client";

import { useState } from "react";
import { z } from "zod";
import type { TrackingLookupResponse } from "@/types/tracking";

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

export default function MineLightTrackingPage() {
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
    <div className="relative min-h-screen">
      <BackgroundPattern />
      <div className="relative container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 inline-flex items-center gap-2 bg-[#5CB85C] text-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-wide">
          Order Tracking
        </div>

        <div className="bg-[#4A4A4A] border-8 border-black text-white p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] font-minecraft">
              TRACK YOUR LOOT
            </h1>
            <p className="text-gray-200">
              Enter your order number (e.g. #1001 or 1001) and the email used at
              checkout.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">
                Order number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={handleOrderNumberChange}
                placeholder="#1001 or 1001"
                className={`rounded-md border-4 border-black bg-white px-3 py-2 text-sm text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 ${
                  errors.orderNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-yellow-400"
                }`}
                aria-invalid={!!errors.orderNumber}
                aria-describedby={
                  errors.orderNumber ? "orderNumber-error" : undefined
                }
              />
              {errors.orderNumber && (
                <p
                  id="orderNumber-error"
                  className="text-sm text-red-400 font-bold"
                >
                  {errors.orderNumber}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className={`rounded-md border-4 border-black bg-white px-3 py-2 text-sm text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-yellow-400"
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-400 font-bold">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#5CB85C] px-4 py-3 text-sm font-bold text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#4A9B4A] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Searching..." : "Check tracking"}
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-md border-4 border-black bg-red-100 px-4 py-3 text-sm font-bold text-red-800 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}

          {result && !result.found && (
            <div className="rounded-md border-4 border-black bg-yellow-100 px-4 py-3 text-sm font-bold text-yellow-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              No matching order found. Please check your inputs and try again.
            </div>
          )}

          {result && result.found && (
            <div className="space-y-4">
              <div className="bg-[#3A3A3A] border-4 border-black p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-bold text-white mb-2 font-minecraft">
                  Order details
                </h2>
                <p className="text-gray-200 text-sm">
                  Order: {result.order.name}
                </p>
                <p className="text-gray-200 text-sm">
                  Status: {result.order.fulfillmentStatus}
                </p>
                <p className="text-gray-200 text-sm">
                  Placed at:{" "}
                  {new Date(result.order.processedAt).toLocaleString("en-US")}
                </p>
              </div>

              {result.fulfillments.length === 0 && (
                <p className="text-gray-100 text-sm font-bold">
                  Tracking info is not yet available.
                </p>
              )}

              {result.fulfillments.map((fulfillment, index) => (
                <div
                  key={`${fulfillment.status}-${index}`}
                  className="bg-[#3A3A3A] border-4 border-black p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                >
                  <p className="text-sm font-bold text-white">
                    Fulfillments: {fulfillment.status}
                  </p>

                  {fulfillment.tracking.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-200">
                      Tracking number is not yet available.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {fulfillment.tracking.map((tracking) => (
                        <li
                          key={tracking.number}
                          className="flex flex-col gap-1 rounded-md border-4 border-black bg-white p-3 text-sm text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                        >
                          <span className="font-bold">
                            Number: {tracking.number}
                          </span>
                          {tracking.company && (
                            <span className="text-gray-700">
                              Carrier: {tracking.company}
                            </span>
                          )}
                          {tracking.url && (
                            <a
                              href={tracking.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline font-bold hover:text-blue-900"
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
          )}
        </div>
      </div>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-25">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              rgba(0, 100, 0, 0.25) 8px,
              rgba(0, 100, 0, 0.25) 16px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(0, 100, 0, 0.25) 8px,
              rgba(0, 100, 0, 0.25) 16px
            )
          `,
          backgroundSize: "16px 16px",
        }}
      />
    </div>
  );
}
