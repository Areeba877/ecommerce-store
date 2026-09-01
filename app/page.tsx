"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestOffers from "@/components/BestOffers";
import BestSellers from "@/components/BestSellers";
import CategoryCards from "@/components/CategoryCards";
import Brands from "@/components/Brands";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Devices");

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 36,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (
          prev.hours === 0 &&
          prev.minutes === 0 &&
          prev.seconds === 0
        ) {
          return prev;
        }

        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1,
          };
        }

        if (prev.minutes > 0) {
          return {
            hours: prev.hours,
            minutes: prev.minutes - 1,
            seconds: 59,
          };
        }

        return {
          hours: prev.hours - 1,
          minutes: 59,
          seconds: 59,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <Hero />

        {/* Shop By Category */}
        <CategoryCards />

        {/* Featured Collection */}
        <section className="my-5 bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-8 border-b border-gray-200 pb-5 lg:flex-row lg:items-center">
              
              {/* Left Side */}
              <div>
               <span className="inline-flex items-center rounded-full border border-[#155e4a] bg-[#155e4a] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
  🔥 LIMITED TIME FLASH OFFERS
</span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Featured Collection
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                  Handpicked customer favorites and exclusive seasonal deals.
                  Add directly to your cart with one click or save to your
                  wishlist for later.
                </p>
              </div>

              {/* Offer Countdown */}
              <div className="flex items-center gap-2 rounded-2xl border border-[#d9ddc8] bg-white px-5 py-4">
                <span className="mr-2 text-sm font-semibold text-gray-700">
                  🕐 OFFER ENDS IN:
                </span>

                {/* Hours */}
                <span className="rounded-lg bg-[#155e4a] px-3 py-2 text-lg font-bold text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>

                <span className="font-bold text-gray-500">
                  :
                </span>

                {/* Minutes */}
                <span className="rounded-lg bg-[#155e4a] px-3 py-2 text-lg font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>

                <span className="font-bold text-gray-500">
                  :
                </span>

                {/* Seconds */}
                <span className="rounded-lg bg-[#155e4a] px-3 py-2 text-lg font-bold text-white">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Existing sections */}
        <FeaturedProducts selectedCategory={selectedCategory} />
        <BestOffers />
        <BestSellers />
        <Brands />
      </main>

      <Footer />
    </>
  );
}