"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
};

type Deal = {
  _id: string;
  title: string;
  description?: string;
  products: Product[];
  dealPrice: number;
  image?: string;
  active: boolean;
};

export default function DealsPage() {
  const { loading: cartLoading } = useCart();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/deals");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch deals.");
        }

        const activeDeals = (data.deals || []).filter(
          (deal: Deal) => deal.active
        );

        setDeals(activeDeals);
      } catch (error) {
        console.error("Fetch deals error:", error);
        setError("Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-[#f8f7f0] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              🔥 Exclusive Combo Deals
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
              Combo Deals
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Shop multiple products together and save more with our exclusive
              combo offers.
            </p>
          </div>
        </section>

        {/* Deals */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-7xl">
            {loading || cartLoading ? (
              <div className="py-16 text-center text-gray-500">
                Loading deals...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-600">
                {error}
              </div>
            ) : deals.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  No combo deals available
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Check back soon for exciting offers.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {deals.map((deal) => {
                  const individualTotal = deal.products.reduce(
                    (total, product) => total + product.price,
                    0
                  );

                  const savings = individualTotal - deal.dealPrice;

                  return (
                    <div
                      key={deal._id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      {/* Deal Image */}
                      <div className="h-64 bg-gray-100">
                        {deal.image ? (
                          <img
                            src={deal.image}
                            alt={deal.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {deal.title}
                            </h2>

                            {deal.description && (
                              <p className="mt-2 text-sm text-gray-500">
                                {deal.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Save ${savings.toFixed(2)}
                          </span>
                        </div>

                        {/* Products */}
                        <div className="mt-6 space-y-3">
                          {deal.products.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-16 w-16 rounded-lg object-cover"
                              />

                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-gray-900">
                                  {product.name}
                                </h3>

                                <p className="mt-1 text-sm text-gray-600">
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="mt-6 rounded-xl bg-[#f8f7f0] p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              Individual total
                            </span>

                            <span className="text-gray-500 line-through">
                              ${individualTotal.toFixed(2)}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              Combo price
                            </span>

                            <span className="text-2xl font-bold text-green-700">
                              ${deal.dealPrice.toFixed(2)}
                            </span>
                          </div>

                          <div className="mt-2 text-sm font-medium text-green-600">
                            You save ${savings.toFixed(2)}
                          </div>
                        </div>

                        {/* Button */}
                        <button
                          type="button"
                          disabled
                          className="mt-6 w-full cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-600"
                        >
                          Add Combo to Cart — Coming Next
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}