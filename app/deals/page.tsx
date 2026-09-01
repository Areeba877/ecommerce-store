"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function DealsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Deals Header */}
        <section className="bg-[#f8f7f0] px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              
              <div>
                <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                  🔥 Limited Time Flash Offers
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
                  Featured Collection
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                  Handpicked customer favorites and exclusive seasonal
                  deals. Add directly to your cart with one click or save
                  to your wishlist for later.
                </p>
              </div>

              {/* Offer Timer */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#dedcc9] bg-white px-5 py-4">
                <span className="text-sm font-semibold text-gray-700">
                  🕘 OFFER ENDS IN:
                </span>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#303426] px-3 py-2 text-lg font-bold text-white">
                    08
                  </span>

                  <span className="text-xl font-bold text-gray-700">
                    :
                  </span>

                  <span className="rounded-lg bg-[#303426] px-3 py-2 text-lg font-bold text-white">
                    41
                  </span>

                  <span className="text-xl font-bold text-gray-700">
                    :
                  </span>

                  <span className="rounded-lg bg-orange-500 px-3 py-2 text-lg font-bold text-white">
                    41
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Today's Deals
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Grab your favorite products before the offers end.
              </p>
            </div>

            <FeaturedProducts />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}