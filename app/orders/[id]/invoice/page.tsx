"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  paymentMethod: "cod" | "card";
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
            : "Failed to load invoice"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Invoice Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            {error || "Unable to load invoice."}
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-block rounded-lg bg-[#006400] px-6 py-3 font-medium text-white hover:bg-[#004d00]"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Buttons */}
        <div className="mb-6 flex flex-wrap gap-3 print:hidden">
          <Link
            href={`/orders/${order._id}`}
            className="rounded-lg bg-gray-700 px-5 py-2.5 font-medium text-white hover:bg-gray-800"
          >
            Back to Order
          </Link>

          <button
            onClick={() => window.print()}
            className="rounded-lg bg-[#006400] px-5 py-2.5 font-medium text-white hover:bg-[#004d00]"
          >
            Print / Save Invoice
          </button>
        </div>

        {/* Invoice */}
        <div className="rounded-xl bg-white p-8 shadow-md sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#006400]">
                ShopCart
              </h1>

              <p className="mt-2 text-gray-500">
                Your trusted online store
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-3xl font-bold text-gray-900">
                INVOICE
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Invoice #: {order._id}
              </p>

              <p className="text-sm text-gray-500">
                Date:{" "}
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
          </div>

          {/* Customer Information */}
          <div className="grid gap-8 border-b py-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
                Bill To
              </h3>

              <p className="font-semibold text-gray-900">
                {order.customerName}
              </p>

              <p className="text-gray-600">
                {order.customerEmail}
              </p>

              {order.phone && (
                <p className="text-gray-600">{order.phone}</p>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
                Shipping Address
              </h3>

              <p className="text-gray-700">{order.address}</p>

              <p className="text-gray-700">
                {order.city}
                {order.postalCode
                  ? `, ${order.postalCode}`
                  : ""}
              </p>

              <p className="text-gray-700">{order.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="py-8">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Order Items
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Product
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr
                      key={`${item.name}-${index}`}
                      className="border-b"
                    >
                      <td className="px-4 py-4 text-gray-900">
                        {item.name}
                      </td>

                      <td className="px-4 py-4 text-center text-gray-700">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-gray-700">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        $
                        {(item.price * item.quantity).toFixed(
                          2
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end border-t pt-6">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Payment Method
              </p>

              <p className="mt-1 font-bold uppercase text-[#006400]">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Card"}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-semibold text-gray-500">
                Order Status
              </p>

              <p className="mt-1 font-bold capitalize text-gray-900">
                {order.status}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 border-t pt-6 text-center">
            <p className="font-medium text-gray-900">
              Thank you for shopping with ShopCart!
            </p>

            <p className="mt-1 text-sm text-gray-500">
              This invoice was generated electronically.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}