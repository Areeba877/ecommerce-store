
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MailIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 10.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.38 8.38 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z" />
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    orderNumber: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }

      setSuccessMessage(
        data.message || "Your message has been sent successfully!"
      );

      setFormData({
        fullName: "",
        email: "",
        orderNumber: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* Hero */}
        <section className="px-6 pb-12 pt-16 sm:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#155e4a]">
              Contact Us
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-[#123b2a] sm:text-5xl">
              We&apos;re here to help
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Got a question about an order, our products, or shipping?
              Reach out to our customer care team and we&apos;ll get back to
              you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="px-6 pb-16">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Email */}
            <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-6 transition hover:-translate-y-1 hover:border-[#155e4a] hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#155e4a] text-white">
                <MailIcon />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#123b2a]">
                Email Us
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Our team replies fast within 24h
              </p>

              <a
                href="mailto:support@cartify.com"
                className="mt-4 block text-sm font-semibold text-[#155e4a] hover:text-[#0f4939]"
              >
                support@cartify.com
              </a>
            </div>

            {/* Phone */}
            <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-6 transition hover:-translate-y-1 hover:border-[#155e4a] hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#155e4a] text-white">
                <PhoneIcon />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#123b2a]">
                Call Us
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Mon – Fri from 9am to 6pm
              </p>

              <a
                href="tel:+923214578128"
                className="mt-4 block text-sm font-semibold text-[#155e4a] hover:text-[#0f4939]"
              >
                +92 3214578128
              </a>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-6 transition hover:-translate-y-1 hover:border-[#155e4a] hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#155e4a] text-white">
                <LocationIcon />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#123b2a]">
                Visit Studio
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                E2 Block Johar Town
              </p>

              <p className="mt-1 text-sm font-semibold text-[#123b2a]">
                Lahore
              </p>
            </div>

            {/* Live Support */}
            <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-6 transition hover:-translate-y-1 hover:border-[#155e4a] hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#155e4a] text-white">
                <ChatIcon />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#123b2a]">
                Live Support
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Chat with our specialists online
              </p>

              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#155e4a]">
                <span className="h-2 w-2 rounded-full bg-[#155e4a]" />
                Online Now
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form + FAQ */}
        <section className="border-t border-gray-200 bg-[#fcfcfa] px-6 py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl border border-[#e5e7d8] bg-white p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#123b2a] sm:text-[26px]">
                Send our team a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill out the form below and we&apos;ll route your inquiry right
                to the appropriate specialist.
              </p>

              <form className="mt-8" onSubmit={handleSubmit}>
                {/* Full Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullName: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-[#d9ddbd] bg-white px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      placeholder="alex@example.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-[#d9ddbd] bg-white px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
                    />
                  </div>
                </div>

                {/* Order Number + Subject */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Order Number{" "}
                      <span className="font-normal normal-case tracking-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. CFY-842190"
                      value={formData.orderNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderNumber: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-[#d9ddbd] bg-white px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Subject Matter *
                    </label>

                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subject: e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-xl border border-[#d9ddbd] bg-white px-4 text-sm text-gray-700 outline-none focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
                    >
                      <option>General Inquiry</option>
                      <option>Order Status & Tracking</option>
                      <option>Returns & Exchanges</option>
                      <option>Product Feedback</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                    Your Message *
                  </label>

                  <textarea
                    rows={6}
                    required
                    minLength={10}
                    placeholder="Tell us how we can help (minimum 10 characters)..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-[#d9ddbd] bg-white px-4 py-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#155e4a] focus:ring-1 focus:ring-[#155e4a]"
                  />
                </div>

                {/* Success Message */}
                {successMessage && (
                  <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-[#155e4a]">
                    {successMessage}
                  </p>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {errorMessage}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-14 w-full rounded-full bg-[#155e4a] px-6 text-sm font-bold text-white transition hover:bg-[#0f4939] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Submit Message"}
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="pt-1 lg:pl-4">
              <h2 className="text-2xl font-bold text-[#123b2a] sm:text-[26px]">
                Frequently Asked Questions
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Quick answers to common questions about shipping, returns, and
                orders.
              </p>

              <div className="mt-7 space-y-4">
                <details className="group rounded-2xl border border-[#e5e7d8] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-6 text-[15px] font-bold text-[#123b2a]">
                    <span>How long does shipping normally take?</span>

                    <span className="ml-4 text-xl text-[#123b2a] transition-transform duration-200 group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>

                  <div className="px-6 pb-6 text-sm leading-6 text-gray-500">
                    Standard shipping usually takes 3–7 business days,
                    depending on your location.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#e5e7d8] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-6 text-[15px] font-bold text-[#123b2a]">
                    <span>What is your 30-day return policy?</span>

                    <span className="ml-4 text-xl text-[#123b2a] transition-transform duration-200 group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>

                  <div className="px-6 pb-6 text-sm leading-6 text-gray-500">
                    Eligible products can be returned within 30 days of
                    delivery, subject to our return conditions.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#e5e7d8] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-6 text-[15px] font-bold text-[#123b2a]">
                    <span>
                      Can I modify or cancel my order after placing it?
                    </span>

                    <span className="ml-4 text-xl text-[#123b2a] transition-transform duration-200 group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>

                  <div className="px-6 pb-6 text-sm leading-6 text-gray-500">
                    Contact our support team as soon as possible. We&apos;ll
                    check whether your order can still be modified or
                    cancelled.
                  </div>
                </details>

                <details className="group rounded-2xl border border-[#e5e7d8] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-6 text-[15px] font-bold text-[#123b2a]">
                    <span>
                      Are your ceramic and wood products sustainably crafted?
                    </span>

                    <span className="ml-4 text-xl text-[#123b2a] transition-transform duration-200 group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>

                  <div className="px-6 pb-6 text-sm leading-6 text-gray-500">
                    We&apos;re committed to working with responsible suppliers
                    and continuously improving our materials and production
                    practices.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

