"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [verificationUrl, setVerificationUrl] = useState("");
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        setError("Server response error. Check terminal.");
        return;
      }

     if (!response.ok) {
  setError(data.message || "Signup failed.");
  return;
}

setSuccess(
  "Account created successfully! Please verify your email before logging in."
);

if (data.verificationUrl) {
  setVerificationUrl(data.verificationUrl);
}

setName("");
setEmail("");
setPassword("");
setConfirmPassword("");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-8">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col items-center justify-center">
        <Link
          href="/"
          className="group text-[23px] font-extrabold tracking-tight"
        >
          <span className="text-[#123b2a] transition-colors duration-300 group-hover:text-[#2f9638]">
            SHOPCAR
          </span>
          <span className="text-[#2f9638] transition-colors duration-300 group-hover:text-[#123b2a]">
            T
          </span>
        </Link>

        <div className="mt-5 w-full rounded-2xl bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.10)]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign up to get started with ShopCart.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a] disabled:bg-gray-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use 8+ characters with uppercase, lowercase, number and special character.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a] disabled:bg-gray-100"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

         {success && (
  <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
    <p>{success}</p>

    {verificationUrl && (
      <a
        href={verificationUrl}
        className="mt-3 inline-block font-semibold text-[#155e4a] underline"
      >
        Verify your email
      </a>
    )}
  </div>
)}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#155e4a] px-4 py-3 font-semibold text-white transition hover:bg-[#0f4939] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#155e4a] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}