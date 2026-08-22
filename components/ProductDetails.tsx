"use client";

import { useState } from "react";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useWishlist } from "../app/WishlistContext";
import { useCart } from "@/context/CartContext";

type ProductDetailsProps = {
  product: {
    id: string;
    image: string;
    category: string;
    name: string;
    price: string;
    oldPrice: string;
    badge?: string;

    brand?: string;
    collection?: string;
    type?: string;
    stock?: string;
  };
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [showCharacteristics, setShowCharacteristics] = useState(false);

  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const price = Number(
    product.price.replace("$", "").replace(",", "")
  );

const handleAddToCart = () => {
  for (let i = 0; i < quantity; i++) {
    addToCart(product.id);
  }

  alert(`${product.name} added to cart!`);
};

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Main Product Area */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:h-[520px]">

              {/* Badge */}
              {product.badge && (
                <span className="absolute left-4 top-4 z-10 rounded-full border border-green-400 bg-white px-4 py-1 text-xs font-semibold text-black">
                  {product.badge}
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-8"
              />
            </div>

            {/* Thumbnail */}
            <div className="mt-4">
              <button
                type="button"
                className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[#155e4a] bg-white p-2"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-start pt-0">

            {/* Name */}
            <h1 className="mt-3 text-xl font-bold leading-tight text-black sm:text-2xl">
              {product.name}
            </h1>

            {/* Description */}
            <p className="mt-2 max-w-xl text-base leading-6 text-gray-600">
              {product.category} — {product.name}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-green-700">★★★★★</span>

              <span className="font-semibold text-gray-800">
                4.8
              </span>

              <span className="text-sm text-gray-500">
                (98 Reviews)
              </span>
            </div>

            {/* Price & Stock Box */}
            <div className="mt-5 border-y border-gray-200 py-4">

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  {product.oldPrice}
                </span>
              </div>

              <p
                className={`mt-2 font-medium ${
                  product.stock === "Available"
                    ? "text-green-800"
                    : "text-red-600"
                }`}
              >
                {product.stock}
              </p>
            </div>

            {/* Quantity + Cart */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              {/* Quantity */}
              <div className="flex w-fit items-center rounded-full border border-gray-300 bg-white">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="px-5 py-3 text-lg text-gray-600"
                >
                  −
                </button>

                <span className="min-w-10 text-center font-semibold text-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                  className="px-5 py-3 text-lg text-gray-600"
                >
                  +
                </button>

              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-[#155e4a] px-6 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
              >
                🛒 Add to Cart — $
                {(price * quantity).toLocaleString()}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  isWishlisted(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                  isWishlisted(product.id)
                    ? "border-[#155e4a] text-[#155e4a]"
                    : "border-green-300 text-gray-700 hover:border-[#155e4a] hover:text-[#155e4a]"
                }`}
              >
                <span className="text-3xl">
                  {isWishlisted(product.id) ? "♥" : "♡"}
                </span>
              </button>

            </div>

            {/* Shipping / Warranty / Returns */}
            <div className="mt-6 grid grid-cols-1 gap-6 border-y border-gray-200 py-6 sm:grid-cols-3">

              {/* Free Shipping */}
              <div className="flex flex-col items-center text-center">
                <Truck className="mb-2 h-6 w-6 text-[#4b5133]" />

                <p className="text-sm text-gray-900">
                  Free Express Shipping
                </p>
              </div>

              {/* Warranty */}
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-2 h-6 w-6 text-[#4b5133]" />

                <p className="text-sm text-gray-900">
                  6-months Warranty
                </p>
              </div>

              {/* Returns */}
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="mb-2 h-6 w-6 text-[#4b5133]" />

                <p className="text-sm text-gray-900">
                  10-Day Hassle-Free Returns
                </p>
              </div>

            </div>

            {/* Product Characteristics Dropdown */}
            <div className="mt-2 pt-5">

              <button
                type="button"
                onClick={() =>
                  setShowCharacteristics(!showCharacteristics)
                }
                className="flex w-full items-center justify-between text-left"
              >
                <h2 className="text-base font-bold text-black">
                  {product.name}: Characteristics
                </h2>

                <span
                  className={`text-xl text-gray-600 transition-transform ${
                    showCharacteristics
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              {showCharacteristics && (
                <div className="mt-4 space-y-2 pb-4">

                  {/* Brand */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">
                      Brand:
                    </span>

                    <span className="font-semibold text-black">
                      {product.brand}
                    </span>
                  </div>

                  {/* Collection */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">
                      Collection:
                    </span>

                    <span className="font-semibold text-black">
                      {product.collection}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">
                      Type:
                    </span>

                    <span className="font-semibold text-black">
                      {product.type}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">
                      Stock:
                    </span>

                    <span className="font-semibold text-black">
                      {product.stock}
                    </span>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}