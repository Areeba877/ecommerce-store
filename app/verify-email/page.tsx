"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const verificationCode = code.join("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email verification failed.");
        return;
      }

      setMessage("Email verified successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend verification code.");
        return;
      }

      setCode(["", "", "", "", "", ""]);
      setTimeLeft(60);
      setMessage("A new verification code has been sent.");

      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend code error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.10)]">
        <h1 className="text-3xl font-bold text-gray-900">
          Verify your email
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit code we sent to your email.
        </p>

        <form onSubmit={handleVerify} className="mt-8">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
          />

          <label className="mb-3 mt-6 block text-sm font-medium text-gray-700">
            Verification code
          </label>

          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleCodeChange(e.target.value, index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading}
                className="h-12 w-12 rounded-xl border border-gray-300 text-center text-lg font-semibold outline-none focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
              />
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#155e4a] px-4 py-3 font-semibold text-white hover:bg-[#0f4939] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {timeLeft > 0 ? (
            <p className="mt-4 text-center text-sm text-gray-500">
              Code expires in{" "}
              <span className="font-semibold text-[#155e4a]">
                {timeLeft}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="mt-4 w-full text-sm font-semibold text-[#155e4a] underline"
            >
              Resend verification code
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#155e4a] underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading...
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}