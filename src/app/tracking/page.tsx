"use client";

import { useState } from "react";

import type { TrackingLookupResponse } from "@/types/tracking";

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingLookupResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);
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
        throw new Error(data?.message || "検索に失敗しました。");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("検索に失敗しました。時間をおいて再試行してください。");
    } finally {
      setLoading(false);
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
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="#1001 or 1001"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
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
