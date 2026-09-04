"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  product?: {
    _id: string;
    name: string;
    image?: string;
    price: number;
  };
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "cod" | "card";
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data.order);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-gray-600">
          {error || "The requested order could not be found."}
        </p>

        <Link
          href="/orders"
          className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
        >
          Back to Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
      
      <div className="mb-6 flex items-center justify-between">
  <Link
    href="/orders"
    className="text-green-600 hover:underline"
  >
    ← Back to Orders
  </Link>

  <Link
    href={`/orders/${orderId}/invoice`}
className="rounded-lg bg-[#064e3b] px-5 py-2 font-medium text-white hover:bg-[#053b2d]"
>
    View / Print Invoice
  </Link>
</div>

        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Order ID: {order._id}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Placed on:{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold capitalize text-green-700">
            {order.status}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-xl font-semibold">
              Ordered Products
            </h2>

            <div className="space-y-5">
              {order.items.map((item, index) => (
                <div
                  key={`${item.product?._id || item.name}-${index}`}
                  className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 font-medium text-green-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <p className="mt-1 font-semibold uppercase">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Card"}
                </p>
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                Shipping Information
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {order.customerName}
                </p>

                <p>
                  <strong>Email:</strong> {order.customerEmail}
                </p>

                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.shippingAddress.address}
                </p>

                <p>
                  <strong>City:</strong> {order.shippingAddress.city}
                </p>

                <p>
                  <strong>Postal Code:</strong>{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <p>
                  <strong>Country:</strong>{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}