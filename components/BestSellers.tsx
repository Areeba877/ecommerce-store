"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/app/WishlistContext";
import { useCart } from "@/context/CartContext";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
};

export default function BestSellers() {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Best Sellers ke liye first 5 products
  const bestSellers = products.slice(0, 5);

  return (
    <section className="bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            Best Sellers
          </h2>

          <Link
            href="/shop"
            className="text-sm font-semibold text-[#155e4a] hover:underline"
          >
            View all
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {bestSellers.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Product Image */}
              <div className="relative flex h-52 items-center justify-center bg-gray-50 p-2">

                {/* Badge */}
                {product.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-full border border-green-400 bg-white px-3 py-1 text-xs font-medium text-black">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product._id)}
                  aria-label={
                    isWishlisted(product._id)
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    isWishlisted(product._id)
                      ? "bg-[#155e4a] text-white"
                      : "bg-white text-gray-700 hover:bg-[#155e4a] hover:text-white"
                  }`}
                >
                  <span className="text-xl">
                    {isWishlisted(product._id) ? "♥" : "♡"}
                  </span>
                </button>

                {/* Product Image */}
                <Link
                  href={`/products/${product._id}`}
                  className="h-full w-full"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full cursor-pointer object-contain"
                  />
                </Link>
              </div>

              {/* Product Details */}
              <div className="p-4">

                <p className="text-xs text-gray-400">
                  {product.category}
                </p>

                <Link href={`/products/${product._id}`}>
                  <h3 className="mt-1 cursor-pointer truncate text-sm font-semibold text-black hover:text-[#155e4a]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="mt-2 text-sm text-green-500">
                  ★★★★★
                </div>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-black">
                    ${product.price.toLocaleString()}
                  </span>

                  {product.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await addToCart(product._id);
                      alert(`${product.name} added to cart!`);
                    } catch (error) {
                      console.error(
                        "Add to cart error:",
                        error
                      );
                    }
                  }}
                  className="mt-4 w-full rounded-full bg-[#155e4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f4939]"
                >
                  Add to Cart
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}