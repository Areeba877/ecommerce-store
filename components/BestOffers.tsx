"use client";

import Link from "next/link";

export default function BestOffers() {
  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-gradient-to-r from-[#155e4a] via-[#2f9638] to-[#155e4a] shadow-lg">

        {/* Soft glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)]" />

        {/* Dots */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "13px 13px",
          }}
        />

        {/* Left cut */}
        <div
          className="absolute left-0 top-0 h-full w-20 bg-[#f7fff3] sm:w-28"
          style={{
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
          }}
        />

        {/* Right cut */}
        <div
          className="absolute right-0 top-0 h-full w-20 bg-[#f7fff3] sm:w-28"
          style={{
            clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
          }}
        />

        <div className="relative flex h-[175px] items-center justify-center sm:h-[195px] lg:h-[210px]">

          {/* LEFT PRODUCT */}
          <div className="absolute -bottom-5 left-[2%] z-20 h-[155px] w-[155px] sm:left-[7%] sm:h-[190px] sm:w-[190px] lg:left-[10%] lg:h-[215px] lg:w-[215px]">
            <img
              src="/products/product2.png"
              alt="Special offer"
              className="h-full w-full object-contain drop-shadow-[0_15px_12px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-2"
            />
          </div>

          {/* CENTER */}
          <div className="relative z-30 flex flex-col items-center text-center">

            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-white/80 sm:text-xs">
              Limited Time Deals
            </p>

            <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Best{" "}
              <span className="text-[#d9ff4f]">
                Offers
              </span>
            </h2>

            <div className="mt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#d9ff4f] px-7 py-2 text-xs font-black uppercase text-[#155e4a] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:px-9 sm:py-2.5 sm:text-sm"
              >
                Shop Now
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT PRODUCT */}
          <div className="absolute -bottom-5 right-[2%] z-20 h-[155px] w-[155px] sm:right-[7%] sm:h-[190px] sm:w-[190px] lg:right-[10%] lg:h-[215px] lg:w-[215px]">
            <img
              src="/products/product3.png"
              alt="Special offer"
              className="h-full w-full object-contain drop-shadow-[0_15px_12px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-2"
            />
          </div>

          {/* Small badges */}
          <div className="absolute left-[24%] top-5 hidden rounded-full bg-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:block">
            Hot Deal
          </div>

          <div className="absolute right-[24%] top-5 hidden rounded-full bg-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:block">
            New
          </div>
        </div>
      </div>
    </section>
  );
}