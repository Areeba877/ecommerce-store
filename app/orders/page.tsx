"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: "cod" | "card";
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: {
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-red-600">
              Unable to Load Orders
            </h2>

            <p className="mt-2 text-gray-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-600">
              You have not placed any orders yet.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage your previous orders.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="mt-1 break-all font-semibold text-gray-900">
                    {order._id}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                      order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  <p className="text-lg font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="py-5">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Items
                </h2>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-4"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                          No Image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-gray-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-medium uppercase text-gray-900">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Card"}
                  </p>
                </div>

                <Link
                  href={`/orders/${order._id}`}
className="rounded-lg bg-[#006400] px-5 py-2.5 text-center font-medium text-white transition hover:bg-[#004d00]"

>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}