"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { products } from "@/components/products";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-500">
            Thank you for your purchase. Your order has been received.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-block rounded-full bg-[#155e4a] px-7 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add products to your cart before proceeding to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-block rounded-full bg-[#155e4a] px-7 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Complete your information to place your order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Customer Information */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    required
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <input
                    required
                    type="text"
                    placeholder="Street address"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      City
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="City"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Postal Code
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="Postal code"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>

                  <select
                    required
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#155e4a]"
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4">
                  <input
                    required
                    type="radio"
                    name="payment"
                    value="cod"
                    defaultChecked
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Card payment integration will be added later.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => {
                const product = products.find(
                  (product) => product.id === item.productId
                );

                if (!product) return null;

                const price = Number(
                  String(product.price).replace("$", "").replace(",", "")
                );

                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 border-b border-gray-100 pb-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatPrice(price)} × {item.quantity}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(product.id)
                          }
                          className="h-7 w-7 rounded-full border border-gray-300 text-gray-600"
                        >
                          −
                        </button>

                        <span className="w-5 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(product.id)
                          }
                          className="h-7 w-7 rounded-full border border-gray-300 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>

                <span className="font-semibold text-green-700">
                  Free
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[#155e4a] px-5 py-3 font-semibold text-white transition hover:bg-[#0f4939]"
            >
              Place Order — {formatPrice(total)}
            </button>

            <Link
              href="/cart"
              className="mt-3 block text-center text-sm font-medium text-[#155e4a] hover:underline"
            >
              Back to Cart
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}