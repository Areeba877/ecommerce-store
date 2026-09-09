"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export default function WishlistPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();

        setProducts(data.wishlist?.products || []);
      } catch (error) {
        console.error("Wishlist fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingId(productId);

      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      setProducts((current) =>
        current.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>

          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#155e4a]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#155e4a]">
            Saved for later
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Products you've saved for your next purchase.
          </p>
        </div>

        {/* Empty Wishlist */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f7f5] text-2xl text-[#155e4a]">
              ♡
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Save products you love and they will appear here.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-[#155e4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f4939]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {products.length}{" "}
                {products.length === 1 ? "item" : "items"} saved
              </p>

              <Link
                href="/shop"
                className="text-sm font-semibold text-[#155e4a] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product._id}`}
                    className="block"
                  >
                    <div className="relative flex h-64 items-center justify-center bg-[#f8f8f8] p-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-5">

                    {product.category && (
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        {product.category}
                      </p>
                    )}

                    <Link href={`/products/${product._id}`}>
                      <h2 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900 transition hover:text-[#155e4a]">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="mt-3 text-lg font-bold text-gray-900">
                      $
                      {product.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 rounded-full bg-[#155e4a] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0f4939]"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(product._id)
                        }
                        disabled={removingId === product._id}
                        className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingId === product._id
                          ? "..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </>
        )}
      </div>
    </main>
  );
}