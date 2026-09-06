"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentOrder {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  total?: number;
  status?: string;
  createdAt: string;
}

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load dashboard");
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-[#123b2a]">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-[#123b2a]">
          Admin Dashboard
        </h1>

        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#123b2a]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Overview of your ShopCart store.
          </p>
        </div>

        {/* Admin Navigation */}
<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
  <Link
    href="/admin/users"
    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-600 hover:bg-green-50"
  >
    <p className="font-semibold text-[#123b2a]">User Management</p>
    <p className="mt-1 text-sm text-gray-500">
      Manage users and roles
    </p>
  </Link>

  <Link
    href="/admin/products"
    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-600 hover:bg-green-50"
  >
    <p className="font-semibold text-[#123b2a]">Product Management</p>
    <p className="mt-1 text-sm text-gray-500">
      Manage store products
    </p>
  </Link>

  <Link
    href="/admin/categories"
    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-600 hover:bg-green-50"
  >
    <p className="font-semibold text-[#123b2a]">Category Management</p>
    <p className="mt-1 text-sm text-gray-500">
      Manage product categories
    </p>
  </Link>

  <Link
    href="/admin/orders"
    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-600 hover:bg-green-50"
  >
    <p className="font-semibold text-[#123b2a]">Order Management</p>
    <p className="mt-1 text-sm text-gray-500">
      View and manage orders
    </p>
  </Link>

  <Link
    href="/admin/analytics"
    className="rounded-xl border border-green-600 bg-green-50 p-5 shadow-sm transition hover:bg-green-100"
  >
    <p className="font-semibold text-[#123b2a]">Analytics</p>
    <p className="mt-1 text-sm text-gray-600">
      View store performance
    </p>
  </Link>
</div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-[#064e3b]">
              {data?.totalUsers ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-[#064e3b]">
              {data?.totalProducts ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-[#064e3b]">
              {data?.totalOrders ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="mt-2 text-3xl font-bold text-[#064e3b]">
              ${Number(data?.totalRevenue ?? 0).toFixed(2)}
            </p>
          </div>

        </div>

        {/* Recent Orders */}
        <section className="mt-10 overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#123b2a]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest orders placed in your store.
            </p>
          </div>

          <div className="overflow-x-auto">

            {data?.recentOrders?.length ? (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-6 py-4">
                      Order ID
                    </th>

                    <th className="px-6 py-4">
                      Customer
                    </th>

                    <th className="px-6 py-4">
                      Total
                    </th>

                    <th className="px-6 py-4">
                      Payment
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        #{order._id.slice(-8)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {order.customerName || "Customer"}
                        </div>

                        <div className="text-sm text-gray-500">
                          {order.customerEmail || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#064e3b]">
                        ${Number(order.total ?? 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 capitalize text-gray-700">
                        {order.paymentMethod || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                          {order.status || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent orders found.
              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}