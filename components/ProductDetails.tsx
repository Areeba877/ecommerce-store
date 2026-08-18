"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useWishlist } from "../app/WishlistContext";
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
  const price = Number(product.price.replace("$", "").replace(",", ""));

  const handleAddToCart = () => {
    alert(`${quantity} × ${product.name} added to cart!`);
  };

  return (
<main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
<div className="mx-auto max-w-7xl">

        {/* Main Product Area */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT */}
          <div>
<div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:h-[520px]">              
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
              <button className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[#155e4a] bg-white p-2">
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
            <h1 className="mt-3 text-1xl font-bold leading-tight text-black sm:text-2xl">
              {product.name}
            </h1>

                     {/* Description */}
 <p className="mt-2 max-w-xl text-base leading-6 text-gray-600">
  Enjoy immersive sound with the Apple AirPods 3rd generation...
</p>

<div className=" flex items-center gap-2">
  <span className="text-green-700">★★★★★</span>
  <span className="font-semibold text-gray-800">4.8</span>
  <span className="text-sm text-gray-500">(98 Reviews)</span>
</div>
      
{/* Price & Stock Box */}
<div className="mt-5 border-y border-gray-200 py-4">
  <div className="flex items-center gap-3">
    <span className="text-3xl font-bold text-gray-900">
      $699.00
    </span>

    <span className="text-lg text-gray-400 line-through">
      $799.00
    </span>
  </div>

  <p className="mt-2 font-medium text-green-800">
    In Stock
  </p>
</div>

            {/* Quantity + Cart */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <div className="flex w-fit items-center rounded-full border border-gray-300 bg-white">
                <button
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="px-5 py-3 text-lg text-gray-600"
                >
                  −
                </button>

                <span className="min-w-10 text-center font-semibold text-black">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-5 py-3 text-lg text-gray-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-[#155e4a] px-6 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
              >
                🛒 Add to Cart — $
                {(price * quantity).toLocaleString()}
              </button>

   <button
  onClick={() => toggleWishlist(product.id)}
  className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
    isWishlisted(product.id)
      ? "border-[#155e4a] text-[#155e4a]"
      : "border-green-300 text-green"
  }`}
>
  <span className="text-3xl">
    {isWishlisted(product.id) ? "♥" : "♡"}
  </span>
</button>

            </div>

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
    showCharacteristics ? "rotate-180" : ""
  }`}
>
 ⌄
</span>
  </button>

 {showCharacteristics && (
<div className="mt-4 space-y-2 pb-4">
    <div className="flex items-center justify-between text-sm">
      <span className="text-black">
        Brand:
      </span>
      <span className="font-semibold text-black">
        {product.brand}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-black">
        Collection:
      </span>
      <span className="font-semibold text-black">
        {product.collection}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-black">
        Type:
      </span>
      <span className="font-semibold text-black">
        {product.type}
      </span>
    </div>

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