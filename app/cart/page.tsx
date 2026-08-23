"use client";

import Link from "next/link";
import { products } from "@/components/products";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
  } = useCart();

  const total = getCartTotal();

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart to get started.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-[#155e4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f4939]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = products.find(
                  (product) => product.id === item.productId
                );

                if (!product) {
                  return null;
                }

                const price = Number(
                  product.price.replace("$", "").replace(",", "")
                );

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-5 rounded-2xl border border-gray-200 p-5 sm:flex-row sm:items-center"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-gray-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">
                        {product.category}
                      </p>

                      <Link href={`/products/${product.id}`}>
                        <h2 className="mt-1 font-semibold text-gray-900 hover:text-[#155e4a]">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-2 font-bold text-gray-900">
                        {product.price}
                      </p>

                      {/* Quantity */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(product.id)
                            }
                            className="px-4 py-2 text-lg text-gray-600"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(product.id)
                            }
                            className="px-4 py-2 text-lg text-gray-600"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(product.id)
                          }
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-400">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        ${(price * item.quantity).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  ${total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Shipping
                </span>

                <span className="font-semibold text-green-700">
                  Free
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ${total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

             <Link
  href="/checkout"
  className="mt-6 block w-full rounded-full bg-[#155e4a] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#0f4939]"
>
  Proceed to Checkout
</Link>

              <Link
                href="/shop"
                className="mt-3 block text-center text-sm font-medium text-[#155e4a] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}