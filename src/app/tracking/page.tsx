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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white text-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-gray-900/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
            Order Tracking
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Track your order
          </h1>
          <p className="text-sm text-gray-600">
            Enter your order number (e.g. #1001 or 1001) and the email used at
            checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-800">
              Order number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={handleOrderNumberChange}
              placeholder="#1001 or 1001"
              className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
                errors.orderNumber
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-black focus:ring-black/10"
              }`}
              aria-invalid={!!errors.orderNumber}
              aria-describedby={errors.orderNumber ? "orderNumber-error" : undefined}
            />
            {errors.orderNumber && (
              <p
                id="orderNumber-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.orderNumber}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-black focus:ring-black/10"
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Searching..." : "Check tracking"}
          </button>
        </form>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && !result.found && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            We couldn&apos;t find an order matching those details. Please
            double-check and try again.
          </div>
        )}

        {result && result.found && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50">
            <div className="mb-4 space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Order details
              </h2>
              <p className="text-sm text-gray-700">
                Order: {result.order.name}
              </p>
              <p className="text-sm text-gray-700">
                Status: {result.order.fulfillmentStatus}
              </p>
              <p className="text-sm text-gray-700">
                Placed at:{" "}
                {new Date(result.order.processedAt).toLocaleString("en-US")}
              </p>
            </div>

            <div className="space-y-4">
              {result.fulfillments.length === 0 && (
                <p className="text-sm text-gray-700">
                  Tracking info is not yet available.
                </p>
              )}

              {result.fulfillments.map((fulfillment, index) => (
                <div
                  key={`${fulfillment.status}-${index}`}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm font-medium text-gray-900">
                    Fulfillment: {fulfillment.status}
                  </p>

                  {fulfillment.tracking.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-700">
                      Tracking number is not yet available.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {fulfillment.tracking.map((tracking) => (
                        <li
                          key={tracking.number}
                          className="flex flex-col gap-1 rounded border border-gray-200 bg-white p-3 text-sm text-gray-900"
                        >
                          <span className="font-medium">
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
                              className="text-blue-600 underline hover:text-blue-800"
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
