"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  product?: {
    _id?: string;
    name?: string;
    image?: string;
    price?: number;
  };
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
};

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  items: OrderItem[];
  shippingAddress?: {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

const statuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders || []);
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch orders.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      setToast({
        type: "success",
        message: "Order status updated successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            Order Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage customer orders and update order status.
          </p>
        </div>

        {toast && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>

              <button
                onClick={() => setToast(null)}
                className="font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          >
            <option value="all">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-green-50">
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Order
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Items
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Total
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs text-gray-500">
                          #{order._id.slice(-8)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.items?.reduce(
                          (total, item) => total + item.quantity,
                          0
                        ) || 0}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm capitalize text-gray-700">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/orders/${order._id}`}
                            className="rounded-lg border border-green-600 px-3 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
                          >
                            View
                          </Link>

                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}