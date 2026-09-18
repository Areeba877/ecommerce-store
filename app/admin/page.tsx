"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Pusher from "pusher-js";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  BarChart3,
  Store,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

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

interface Notification {
  _id: string;
  recipientRole: "user" | "admin";
  title: string;
  message: string;
  type: "order" | "order_status" | "promotion" | "system";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [isNotificationOpen, setIsNotificationOpen] =
    useState(false);

    const [promotionTitle, setPromotionTitle] = useState("");
const [promotionMessage, setPromotionMessage] = useState("");
const [promotionLink, setPromotionLink] = useState("");
const [sendingPromotion, setSendingPromotion] = useState(false);
const [promotionStatus, setPromotionStatus] = useState("");
const [promotionError, setPromotionError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load dashboard"
          );
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

  // Load existing admin notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        setNotifications(result.notifications || []);
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );
      }
    }

    loadNotifications();
  }, []);

  // Realtime Pusher notifications
  useEffect(() => {
    const pusherKey =
      process.env.NEXT_PUBLIC_PUSHER_KEY;

    const pusherCluster =
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error(
        "Pusher environment variables are missing."
      );
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusher.subscribe(
      "private-admin-notifications"
    );

    const handleNotification = (data: {
      notification: Notification;
    }) => {
      if (!data?.notification) {
        return;
      }

      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (notification) =>
            notification._id ===
            data.notification._id
        );

        if (alreadyExists) {
          return previous;
        }

        return [
          data.notification,
          ...previous,
        ];
      });
    };

    channel.bind(
      "notification",
      handleNotification
    );

    channel.bind(
      "pusher:subscription_error",
      (status: unknown) => {
        console.error(
          "Pusher subscription error:",
          status
        );
      }
    );

    return () => {
      channel.unbind(
        "notification",
        handleNotification
      );

      channel.unbind(
        "pusher:subscription_error"
      );

      pusher.unsubscribe(
        "private-admin-notifications"
      );

      pusher.disconnect();
    };
  }, []);

  const unreadNotificationCount =
    notifications.filter(
      (notification) => !notification.isRead
    ).length;

  async function markNotificationAsRead(
    id: string
  ) {
    try {
      const response = await fetch(
        `/api/notifications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: true,
          }),
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  async function markAllNotificationsAsRead() {
    try {
      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  }

  async function sendPromotionalNotification() {
  setPromotionStatus("");
  setPromotionError("");

  if (!promotionTitle.trim() || !promotionMessage.trim()) {
    setPromotionError(
      "Promotion title and message are required."
    );
    return;
  }

  try {
    setSendingPromotion(true);

    const response = await fetch(
      "/api/admin/notifications/promotion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: promotionTitle.trim(),
          message: promotionMessage.trim(),
          link: promotionLink.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to send promotional notification."
      );
    }

    setPromotionStatus(
      `Promotion sent to ${result.successCount ?? 0} users successfully.`
    );

    setPromotionTitle("");
    setPromotionMessage("");
    setPromotionLink("");
  } catch (error) {
    console.error(
      "Failed to send promotional notification:",
      error
    );

    setPromotionError(
      error instanceof Error
        ? error.message
        : "Failed to send promotional notification."
    );
  } finally {
    setSendingPromotion(false);
  }
}

  const orderStats = useMemo(() => {
    const orders = data?.recentOrders || [];

    return {
      completed: orders.filter((order) => {
        const status = order.status?.toLowerCase();

        return (
          status === "completed" ||
          status === "delivered"
        );
      }).length,

      processing: orders.filter(
        (order) =>
          order.status?.toLowerCase() ===
          "processing"
      ).length,

      pending: orders.filter(
        (order) =>
          order.status?.toLowerCase() ===
          "pending"
      ).length,

      cancelled: orders.filter(
        (order) =>
          order.status?.toLowerCase() ===
          "cancelled"
      ).length,
    };
  }, [data]);

  const recentRevenue = useMemo(() => {
    return (data?.recentOrders || []).reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );
  }, [data]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f6]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#176b55]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f6] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#123b2a]">
            Dashboard Error
          </h1>

          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="text-[#123b2a]">
              SHOPCAR
            </span>

            <span className="text-[#2f9638]">
              T
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.name === "Dashboard";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#eaf5ef] text-[#176b55]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#176b55]"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#2f9638]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <p className="mb-4 mt-9 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Store
          </p>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-[#176b55]"
          >
            <Store
              size={19}
              strokeWidth={1.8}
            />

            <span>View Store</span>
          </Link>
        </div>

        {/* Sidebar Bottom */}
        <div className="border-t border-gray-100 p-4">
          <div className="rounded-xl bg-[#f4f8f5] p-4">
            <p className="text-xs font-semibold text-[#123b2a]">
              ShopCart Admin
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Store management panel
            </p>

            <Link
              href="/"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#176b55]"
            >
              Go to store
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-gray-200 p-2.5 text-gray-600 lg:hidden"
              >
                <Menu size={20} />
              </button>

              {/* Search */}
              <div className="relative hidden sm:block">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="h-11 w-64 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#176b55] sm:w-72"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationOpen(
                      (previous) => !previous
                    )
                  }
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                  aria-label="Notifications"
                >
                  <Bell size={19} />

                  {unreadNotificationCount >
                    0 && (
                    <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#2f9638] px-1 text-[9px] font-bold text-white">
                      {unreadNotificationCount >
                      9
                        ? "9+"
                        : unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#123b2a]">
                          Notifications
                        </h3>

                        <p className="text-xs text-gray-400">
                          {unreadNotificationCount}{" "}
                          unread
                        </p>
                      </div>

                      {unreadNotificationCount >
                        0 && (
                        <button
                          onClick={
                            markAllNotificationsAsRead
                          }
                          className="text-xs font-semibold text-[#176b55] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length ===
                      0 ? (
                        <div className="px-4 py-10 text-center">
                          <Bell
                            size={24}
                            className="mx-auto text-gray-300"
                          />

                          <p className="mt-2 text-sm text-gray-500">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map(
                          (notification) => (
                            <button
                              key={
                                notification._id
                              }
                              onClick={() => {
                                if (
                                  !notification.isRead
                                ) {
                                  markNotificationAsRead(
                                    notification._id
                                  );
                                }

                                if (
                                  notification.link
                                ) {
                                  window.location.href =
                                    notification.link;
                                }
                              }}
                              className={`block w-full border-b border-gray-100 px-4 py-4 text-left transition hover:bg-gray-50 ${
                                !notification.isRead
                                  ? "bg-[#f4f8f5]"
                                  : "bg-white"
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2f9638]" />

                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-800">
                                    {
                                      notification.title
                                    }
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-gray-500">
                                    {
                                      notification.message
                                    }
                                  </p>

                                  <p className="mt-2 text-[10px] text-gray-400">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </button>
                          )
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-8 w-px bg-gray-200 sm:block" />

              {/* Admin Profile */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#176b55] text-sm font-bold text-white">
                  A
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    Admin
                  </p>

                  <p className="text-xs text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Page Heading */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#176b55]">
                  Overview
                </p>

                <h1 className="mt-2 text-2xl font-bold text-[#123b2a] sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Monitor your ShopCart store
                  performance.
                </p>
              </div>

              <Link
                href="/admin/products"
                className="flex w-fit items-center gap-2 rounded-xl bg-[#176b55] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125742]"
              >
                <Plus size={17} />
                Add Product
              </Link>
            </div>

{/* Promotional Notifications */}
<section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
  <div className="mb-5">
    <h2 className="text-xl font-semibold text-[#123b2a]">
      Promotional Notification
    </h2>
    <p className="mt-1 text-sm text-gray-500">
      Send a promotional notification to all users.
    </p>
  </div>

  <div className="space-y-4">
    <input
      type="text"
      value={promotionTitle}
      onChange={(e) => setPromotionTitle(e.target.value)}
      placeholder="Promotion title"
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2f9638]"
    />

    <textarea
      value={promotionMessage}
      onChange={(e) => setPromotionMessage(e.target.value)}
      placeholder="Promotion message"
      rows={4}
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2f9638]"
    />

    <input
      type="text"
      value={promotionLink}
      onChange={(e) => setPromotionLink(e.target.value)}
      placeholder="Link (optional), e.g. /products"
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2f9638]"
    />

    {promotionError && (
      <p className="text-sm text-red-600">
        {promotionError}
      </p>
    )}

    {promotionStatus && (
      <p className="text-sm text-green-600">
        {promotionStatus}
      </p>
    )}

    <button
      type="button"
      onClick={sendPromotionalNotification}
      disabled={sendingPromotion}
      className="rounded-xl bg-[#2f9638] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#267d2f] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {sendingPromotion
        ? "Sending..."
        : "Send Promotional Notification"}
    </button>
  </div>
</section>

            {/* Stats */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {/* Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Users
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#123b2a]">
                      {data?.totalUsers ?? 0}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#176b55]">
                    <Users size={20} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-green-50 px-2 py-1 font-semibold text-green-700">
                    Active
                  </span>

                  <span className="text-gray-400">
                    Registered customers
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Products
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#123b2a]">
                      {data?.totalProducts ?? 0}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Package size={20} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                    Store
                  </span>

                  <span className="text-gray-400">
                    Products available
                  </span>
                </div>
              </div>

              {/* Orders */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Orders
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#123b2a]">
                      {data?.totalOrders ?? 0}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <ShoppingCart size={20} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-orange-50 px-2 py-1 font-semibold text-orange-700">
                    Orders
                  </span>

                  <span className="text-gray-400">
                    All store orders
                  </span>
                </div>
              </div>

              {/* Revenue */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Revenue
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#123b2a]">
                      $
                      {Number(
                        data?.totalRevenue ?? 0
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <BarChart3 size={20} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-purple-50 px-2 py-1 font-semibold text-purple-700">
                    Revenue
                  </span>

                  <span className="text-gray-400">
                    Store earnings
                  </span>
                </div>
              </div>
            </section>

            {/* Main Analytics Area */}
            <section className="mt-6 grid gap-6 xl:grid-cols-3">
              {/* Revenue Overview */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-lg font-bold text-[#123b2a]">
                      Revenue Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Revenue from currently loaded
                      recent orders
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
                    Recent Orders
                  </div>
                </div>

                {/* Revenue Summary */}
                <div className="mt-7 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      Recent order revenue
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#123b2a]">
                      ${recentRevenue.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#176b55]" />
                    Orders
                  </div>
                </div>

                {/* Visual Bars */}
                <div className="mt-8 flex h-52 items-end gap-3 border-b border-l border-gray-100 px-3 pb-0">
                  {(data?.recentOrders || [])
                    .slice(0, 8)
                    .reverse()
                    .map((order, index, arr) => {
                      const max = Math.max(
                        ...arr.map((item) =>
                          Number(item.total || 0)
                        ),
                        1
                      );

                      const height =
                        (Number(order.total || 0) /
                          max) *
                        100;

                      return (
                        <div
                          key={order._id}
                          className="flex h-full flex-1 flex-col justify-end"
                        >
                          <div
                            title={`$${Number(
                              order.total || 0
                            ).toFixed(2)}`}
                            className="w-full rounded-t-lg bg-[#176b55] opacity-90 transition hover:opacity-100"
                            style={{
                              height: `${Math.max(
                                height,
                                8
                              )}%`,
                            }}
                          />

                          <span className="mt-3 truncate text-center text-[10px] text-gray-400">
                            #{order._id.slice(-4)}
                          </span>
                        </div>
                      );
                    })}
                </div>

                {!data?.recentOrders?.length && (
                  <div className="mt-10 text-center text-sm text-gray-400">
                    No order data available.
                  </div>
                )}
              </div>

              {/* Order Status */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-[#123b2a]">
                    Order Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Recent order breakdown
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[18px] border-[#e8f1eb]">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#123b2a]">
                        {data?.recentOrders?.length ||
                          0}
                      </p>

                      <p className="text-xs text-gray-400">
                        Recent Orders
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <StatusRow
                    label="Completed"
                    value={orderStats.completed}
                    dot="bg-green-500"
                  />

                  <StatusRow
                    label="Processing"
                    value={orderStats.processing}
                    dot="bg-blue-500"
                  />

                  <StatusRow
                    label="Pending"
                    value={orderStats.pending}
                    dot="bg-orange-500"
                  />

                  <StatusRow
                    label="Cancelled"
                    value={orderStats.cancelled}
                    dot="bg-red-500"
                  />
                </div>
              </div>
            </section>

            {/* Bottom Area */}
            <section className="mt-6 grid gap-6 xl:grid-cols-3">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#123b2a]">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your store
                </p>

                <div className="mt-6 space-y-3">
                  <QuickAction
                    href="/admin/products"
                    title="Manage Products"
                    description="Add and update products"
                    icon={<Package size={18} />}
                  />

                  <QuickAction
                    href="/admin/orders"
                    title="Manage Orders"
                    description="Review customer orders"
                    icon={<ShoppingCart size={18} />}
                  />

                  <QuickAction
                    href="/admin/users"
                    title="Manage Users"
                    description="View customers and roles"
                    icon={<Users size={18} />}
                  />

                  <QuickAction
                    href="/admin/analytics"
                    title="View Analytics"
                    description="Analyze store performance"
                    icon={<BarChart3 size={18} />}
                  />
                </div>
              </div>

              {/* Store Snapshot */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#123b2a]">
                      Store Snapshot
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Current ShopCart store overview
                    </p>
                  </div>

                  <Store
                    size={21}
                    className="text-[#176b55]"
                  />
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <Snapshot
                    label="Products"
                    value={
                      data?.totalProducts ?? 0
                    }
                    description="Available in store"
                  />

                  <Snapshot
                    label="Orders"
                    value={data?.totalOrders ?? 0}
                    description="Orders received"
                  />

                  <Snapshot
                    label="Customers"
                    value={data?.totalUsers ?? 0}
                    description="Registered users"
                  />
                </div>

                <div className="mt-6 rounded-xl bg-[#f4f8f5] p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-semibold text-[#123b2a]">
                        Keep your store organized
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Manage products, orders and
                        customers from the admin panel.
                      </p>
                    </div>

                    <Link
                      href="/admin/orders"
                      className="flex w-fit items-center gap-2 text-sm font-semibold text-[#176b55]"
                    >
                      View Orders
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Orders */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-[#123b2a]">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest orders placed in your store
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#176b55] hover:text-[#176b55]"
                  >
                    View All
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                {data?.recentOrders?.length ? (
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#fafcfb] text-left text-xs uppercase tracking-wide text-gray-400">
                        <th className="px-6 py-4">
                          Order
                        </th>

                        <th className="px-6 py-4">
                          Customer
                        </th>

                        <th className="px-6 py-4">
                          Amount
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
                      {data.recentOrders.map(
                        (order) => {
                          const status =
                            order.status?.toLowerCase() ||
                            "pending";

                          const statusClasses =
                            status === "completed" ||
                            status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700";

                          return (
                            <tr
                              key={order._id}
                              className="border-b border-gray-100 last:border-0 transition hover:bg-[#fafcfb]"
                            >
                              <td className="px-6 py-5">
                                <span className="font-semibold text-[#123b2a]">
                                  #
                                  {order._id.slice(
                                    -8
                                  )}
                                </span>
                              </td>

                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5ef] text-sm font-bold text-[#176b55]">
                                    {(
                                      order.customerName ||
                                      "C"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {order.customerName ||
                                        "Customer"}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-400">
                                      {order.customerEmail ||
                                        "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-5">
                                <span className="font-bold text-[#176b55]">
                                  $
                                  {Number(
                                    order.total || 0
                                  ).toFixed(2)}
                                </span>
                              </td>

                              <td className="px-6 py-5 text-sm capitalize text-gray-600">
                                {order.paymentMethod ||
                                  "-"}
                              </td>

                              <td className="px-6 py-5">
                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusClasses}`}
                                >
                                  {status}
                                </span>
                              </td>

                              <td className="px-6 py-5 text-sm text-gray-500">
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-sm text-gray-500">
                    No recent orders found.
                  </div>
                )}
              </div>
            </section>

            <footer className="py-8 text-center text-xs text-gray-400">
              ShopCart Admin Panel • Store Management
              System
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
        />

        <span className="text-sm text-gray-600">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold text-[#123b2a]">
        {value}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3.5 transition hover:border-[#cde4d5] hover:bg-[#f5faf7]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#176b55]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-400">
          {description}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="text-gray-300 transition group-hover:text-[#176b55]"
      />
    </Link>
  );
}

function Snapshot({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-[#fafcfb] p-5">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#123b2a]">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}