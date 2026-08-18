"use client";

import Link from "next/link";

export default function BestOffers() {
  return (
    <section className="px-5 py-6 sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-gradient-to-r from-[#e9f8e6] via-[#f7fff3] to-[#e9f8e6]">

        {/* Soft diagonal light effect */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,0.7)_50%,transparent_65%)]" />

        {/* Left dotted pattern */}
        <div
          className="absolute left-[5%] top-0 h-full w-[28%] opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#7acb78 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Right dotted pattern */}
        <div
          className="absolute right-[5%] top-0 h-full w-[28%] opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#7acb78 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Left green arrow */}
        <div className="absolute left-0 top-0 z-30 h-full w-[85px] bg-[#155e4a] [clip-path:polygon(0_0,100%_50%,0_100%)]" />

        {/* Right green arrow */}
        <div className="absolute right-0 top-0 z-30 h-full w-[85px] bg-[#155e4a] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />

        <div className="relative z-10 flex h-[155px] items-center justify-center sm:h-[170px]">

          {/* LEFT PRODUCT */}
          <div className="absolute bottom-[-8px] left-[6%] z-20 h-[165px] w-[165px] sm:left-[10%] sm:h-[185px] sm:w-[185px]">
            <img
              src="/products/product2.png"
              alt="Special offer product"
              className="h-full w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* CENTER CONTENT */}
          <div className="relative z-30 flex flex-col items-center text-center">

            <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-[#155e4a] sm:text-5xl lg:text-6xl">
              Best{" "}
              <span className="text-[#2f9638]">
                Offers
              </span>
            </h2>

            <Link
              href="/shop"
              className="mt-3 rounded-full bg-[#2f9638] px-7 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#267d2f] sm:px-9 sm:py-2.5 sm:text-sm"
            >
              SHOP NOW
            </Link>

          </div>

          {/* RIGHT PRODUCT */}
          <div className="absolute bottom-[-8px] right-[6%] z-20 h-[165px] w-[165px] sm:right-[10%] sm:h-[185px] sm:w-[185px]">
            <img
              src="/products/product3.png"
              alt="Special offer product"
              className="h-full w-full object-contain drop-shadow-xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}