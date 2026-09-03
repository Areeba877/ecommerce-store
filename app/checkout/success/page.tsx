"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const hasVerified = useRef(false);

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Invalid payment session.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Payment verification failed."
          );
        }

        setVerified(true);
      } catch (err) {
        console.error("Payment verification error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Payment verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf4eb]">
          <Loader2
            size={42}
            className="animate-spin text-[#123b2a]"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#123b2a]">
          Verifying Payment...
        </h1>

        <p className="mt-4 text-gray-600">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <XCircle
            size={48}
            strokeWidth={1.8}
            className="text-red-500"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#123b2a]">
          Payment Verification Failed
        </h1>

        <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
          {error || "We could not verify your payment."}
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/checkout"
            className="rounded-xl bg-[#123b2a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2d20]"
          >
            Back to Checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf4eb]">
        <CheckCircle
          size={48}
          strokeWidth={1.8}
          className="text-[#123b2a]"
        />
      </div>

      <h1 className="mt-6 text-3xl font-bold text-[#123b2a] sm:text-4xl">
        Payment Successful!
      </h1>

      <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
        Thank you for your order. Your payment has been
        successfully verified and your order has been created.
      </p>

      <p className="mt-3 text-sm text-gray-500">
        We will process your order and keep you updated.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/products"
          className="rounded-xl bg-[#123b2a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2d20]"
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-[#123b2a] px-6 py-3 text-sm font-semibold text-[#123b2a] transition hover:bg-[#f3f7f4]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="text-center text-[#123b2a]">
              Verifying payment...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}