"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">
          Verify your email
        </h1>

        {success === "true" ? (
          <>
            <p className="mt-4 text-green-700">
              Email verified successfully!
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Redirecting you to login...
            </p>
          </>
        ) : (
          <p className="mt-4 text-gray-600">
            Please verify your email using the link sent to your email address.
          </p>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7f2] flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}