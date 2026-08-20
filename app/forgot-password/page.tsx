"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }

    if (data.resetUrl) {
      window.location.href = data.resetUrl;
      return;
    }

    setMessage(data.message);
  } catch {
    setError("Network or server connection failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we&apos;ll help you reset your password.
        </p>

        {message && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <button
  type="submit"
  onClick={() => console.log("RESET BUTTON CLICKED")}
  disabled={loading}
  className="w-full bg-[#155e4a] text-white py-3 rounded-full font-semibold disabled:opacity-50"
>
  {loading ? "Sending..." : "Send Reset Link"}
</button>
        </form>

        <p className="mt-4 text-sm text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[#155e4a] underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}

