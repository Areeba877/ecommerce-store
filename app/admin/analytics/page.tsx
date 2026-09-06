"use client";

import { useEffect, useState } from "react";

type StatusData = {
  _id: string;
  count: number;
};

type PaymentData = {
  _id: string;
  count: number;
  revenue: number;
};

type DailySales = {
  _id: string;
  orders: number;
  revenue: number;
};

type Analytics = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: StatusData[];
  payments: PaymentData[];
  dailySales: DailySales[];
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load analytics.");
        }

        return data;
      })
      .then((data) => {
        setAnalytics(data.analytics);
      })
      .catch((error) => {
        setError(error.message || "Failed to load analytics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Overview
          </h1>
          <p className="mt-1 text-gray-600">
            Monitor your store performance and sales activity.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="mt-2 text-2xl font-bold text-green-700">
              ${analytics.totalRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {analytics.totalOrders}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Average Order Value</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              ${analytics.averageOrderValue.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {analytics.totalUsers}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {analytics.totalProducts}
            </h2>
          </div>
        </div>

        {/* Orders by Status + Payment Methods */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Orders by Status
            </h2>

            <div className="space-y-4">
              {analytics.ordersByStatus.length === 0 ? (
                <p className="text-gray-500">No order status data.</p>
              ) : (
                analytics.ordersByStatus.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <span className="capitalize text-gray-700">
                      {item._id}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {item.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Payment Methods
            </h2>

            <div className="space-y-4">
              {analytics.payments.length === 0 ? (
                <p className="text-gray-500">No payment data.</p>
              ) : (
                analytics.payments.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="capitalize font-medium text-gray-800">
                        {item._id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.count} orders
                      </p>
                    </div>

                    <span className="font-semibold text-green-700">
                      ${item.revenue.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Daily Sales */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Last 7 Days Sales
          </h2>

          {analytics.dailySales.length === 0 ? (
            <p className="text-gray-500">
              No sales recorded during the last 7 days.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.dailySales.map((day) => (
                    <tr key={day._id} className="border-b last:border-0">
                      <td className="px-4 py-4 text-gray-700">
                        {day._id}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        {day.orders}
                      </td>

                      <td className="px-4 py-4 font-semibold text-green-700">
                        ${day.revenue.toFixed(2)}
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