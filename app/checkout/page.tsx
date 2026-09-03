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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);

      const customerName = String(formData.get("customerName") || "");
      const customerEmail = String(formData.get("customerEmail") || "");
      const phone = String(formData.get("phone") || "");

      const address = String(formData.get("address") || "");
      const city = String(formData.get("city") || "");
      const postalCode = String(formData.get("postalCode") || "");
      const country = String(formData.get("country") || "");

      const paymentMethod = String(
        formData.get("payment") || "cod"
      ) as "cod" | "card";

      const shippingAddress = {
        address,
        city,
        postalCode,
        country,
      };

      // ==========================================
      // CARD PAYMENT - STRIPE CHECKOUT
      // ==========================================
      if (paymentMethod === "card") {
        const response = await fetch(
          "/api/stripe/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              customerName,
              customerEmail,
              phone,
              shippingAddress,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to start Stripe Checkout"
          );
        }

        if (!data.url) {
          throw new Error(
            "Stripe Checkout URL was not returned."
          );
        }

        // Redirect to Stripe Checkout
        window.location.href = data.url;

        return;
      }

      // ==========================================
      // CASH ON DELIVERY
      // ==========================================
      // IMPORTANT:
      // /api/orders already clears the cart after
      // successfully creating the COD order.
      // So we do NOT call clearCart() here.
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          customerName,
          customerEmail,
          phone,
          shippingAddress,
          paymentMethod: "cod",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      // Order API has already cleared the cart
      setOrderPlaced(true);
    } catch (error) {
      console.error("Checkout error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // COD SUCCESS SCREEN
  // ==========================================
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

  // ==========================================
  // EMPTY CART
  // ==========================================
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
          {/* CUSTOMER INFORMATION */}
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
                    name="customerName"
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
                    name="customerEmail"
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
                    name="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#155e4a]"
                  />
                </div>
              </div>
            </section>

            {/* SHIPPING ADDRESS */}
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
                    name="address"
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
                      name="city"
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
                      name="postalCode"
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
                    name="country"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#155e4a]"
                  >
                    <option value="" disabled>
                      Select country
                    </option>

                    <option value="Pakistan">
                      Pakistan
                    </option>

                    <option value="United States">
                      United States
                    </option>

                    <option value="United Kingdom">
                      United Kingdom
                    </option>

                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* PAYMENT METHOD */}
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
                      Secure payment powered by Stripe.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
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
                  String(product.price)
                    .replace("$", "")
                    .replace(",", "")
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
                            decreaseQuantity(item.productId)
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
                            increaseQuantity(item.productId)
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

            {/* PRICE SUMMARY */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Shipping
                </span>

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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-[#155e4a] px-5 py-3 font-semibold text-white transition hover:bg-[#0f4939] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Processing..."
                : `Place Order — ${formatPrice(total)}`}
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