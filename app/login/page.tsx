"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-8">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col items-center justify-center">

        {/* ShopCart Logo */}
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

        {/* Login Card */}
        <div className="w-full rounded-2xl bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.10)] mt-5">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Log in to your ShopCart account.
            </p>
          </div>

          <form className="space-y-5">

            {/* Email */}
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
              />
            </div>

            {/* Password */}
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
                placeholder="Your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#155e4a] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-[#155e4a] px-4 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
            >
              Log in
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#155e4a] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}