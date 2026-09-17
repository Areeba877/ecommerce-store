"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useWishlist } from "../app/WishlistContext";
import FCMNotifications from "@/components/FCMNotifications";

type Notification = {
  _id: string;
  recipient?: string;
  recipientRole: "user" | "admin";
  title: string;
  message: string;
  type: "order" | "order_status" | "promotion" | "system";
  link?: string;
  isRead: boolean;
  createdAt?: string;
};

type User = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Featured", href: "/#featured-products" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

function SearchIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function formatNotificationTime(date?: string) {
  if (!date) return "";

  const created = new Date(date);
  const now = new Date();

  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return created.toLocaleDateString();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { wishlist } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] =
    useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  /*
   * Check authentication
   */
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

       const responseText = await res.text();

if (!responseText) {
  console.error(
    "Notifications API returned an empty response:",
    res.status
  );
  return;
}

let data;

try {
  data = JSON.parse(responseText);
} catch (error) {
  console.error(
    "Notifications API returned invalid JSON:",
    responseText
  );
  return;
}

if (!cancelled && res.ok) {
  setNotifications(data.notifications || []);
}



        if (cancelled) return;

        if (res.ok && data.authenticated && data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setNotifications([]);
        }
      } catch (error) {
        console.error("Auth check error:", error);

        if (!cancelled) {
          setIsLoggedIn(false);
          setUser(null);
          setNotifications([]);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  /*
   * Fetch existing notifications
   */
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setNotifications([]);
      return;
    }

    let cancelled = false;

    const fetchNotifications = async () => {
      setIsLoadingNotifications(true);

      try {
        const res = await fetch("/api/notifications", {
          cache: "no-store",
        });

const responseText = await res.text();

if (!responseText) {
  console.error(
    "Notifications API returned an empty response:",
    res.status
  );
  return;
}

let data;

try {
  data = JSON.parse(responseText);
} catch (error) {
  console.error(
    "Notifications API returned invalid JSON:",
    responseText
  );
  return;
}

        if (!cancelled && res.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Notification fetch error:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingNotifications(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user]);

  /*
   * Real-time Pusher notifications
   */
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error("Pusher environment variables are missing.");
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: "/api/pusher/auth",
    });

    const channelName =
      user.role === "admin"
        ? "private-admin-notifications"
        : `private-user-${user.userId}`;

    const channel = pusher.subscribe(channelName);

    const handleNotification = (data: {
      notification: Notification;
    }) => {
      if (!data?.notification) return;

      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (notification) =>
            notification._id === data.notification._id
        );

        if (alreadyExists) {
          return previous;
        }

        return [data.notification, ...previous];
      });
    };

    channel.bind("notification", handleNotification);

    channel.bind("pusher:subscription_error", (status: unknown) => {
      console.error("Pusher subscription error:", status);
    });

    return () => {
      channel.unbind("notification", handleNotification);
      channel.unbind("pusher:subscription_error");

      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [isLoggedIn, user]);

  /*
   * Mark one notification as read
   */
  const handleNotificationClick = async (
    notification: Notification
  ) => {
    try {
      if (!notification.isRead) {
        const res = await fetch(
          `/api/notifications/${notification._id}`,
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

        if (res.ok) {
          setNotifications((previous) =>
            previous.map((item) =>
              item._id === notification._id
                ? { ...item, isRead: true }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
    }

    setShowNotifications(false);

    if (notification.link) {
      router.push(notification.link);
    }
  };

  /*
   * Mark all notifications as read
   */
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (res.ok) {
        setNotifications((previous) =>
          previous.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  /*
   * Logout
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setIsLoggedIn(false);
      setUser(null);
      setNotifications([]);
      setShowNotifications(false);
      setIsMenuOpen(false);

      window.location.href = "/";
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

 return (
  <>
    <FCMNotifications />

    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">   
   
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-[23px] font-extrabold tracking-tight"
        >
          <span className="text-[#123b2a]">SHOPCAR</span>
          <span className="text-[#2f9638]">T</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-7 text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-[#2f9638]"
                  : "text-gray-700 hover:text-[#2f9638]"
              }`}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute bottom-4 left-0 h-[2px] w-full rounded-full bg-[#2f9638]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Search */}
          <button
            type="button"
            className="text-gray-700 transition hover:text-[#2f9638]"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Cart */}
          <button
            type="button"
            className="relative text-gray-700 transition hover:text-[#2f9638]"
            aria-label="Shopping cart"
          >
            <ShoppingBagIcon />
            <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative text-gray-700 transition hover:text-[#2f9638]"
            aria-label="Wishlist"
          >
            <HeartIcon />

            {wishlist && wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Notifications */}
          {isLoggedIn && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowNotifications((previous) => !previous)
                }
                className="relative text-gray-700 transition hover:text-[#2f9638]"
                aria-label="Notifications"
              >
                <BellIcon />

                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-10 z-50 w-[360px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-[#2f9638] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                          <BellIcon />
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          You&apos;re all caught up.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification._id}
                          type="button"
                          onClick={() =>
                            handleNotificationClick(notification)
                          }
                          className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                            !notification.isRead
                              ? "bg-green-50/50"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead
                                  ? "bg-transparent"
                                  : "bg-[#2f9638]"
                              }`}
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
                                {notification.message}
                              </p>

                              <p className="mt-1.5 text-[11px] text-gray-400">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User / Login */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 transition hover:text-[#2f9638]"
              >
                {user.name}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm font-medium text-gray-700 transition hover:text-[#2f9638] disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 transition hover:text-[#2f9638]"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="text-gray-700 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-5 sm:px-8">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-b border-gray-100 py-3.5 text-sm font-medium ${
                    isActive(link.href)
                      ? "text-[#2f9638]"
                      : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 flex items-center gap-5">
              {/* Search */}
              <button
                type="button"
                className="text-gray-700"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              {/* Cart */}
              <button
                type="button"
                className="relative text-gray-700"
                aria-label="Shopping cart"
              >
                <ShoppingBagIcon />

                <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="relative text-gray-700"
                aria-label="Wishlist"
              >
                <HeartIcon />

                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              {isLoggedIn && user && (
                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications((previous) => !previous)
                  }
                  className="relative text-gray-700"
                  aria-label="Notifications"
                >
                  <BellIcon />

                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Notifications */}
            {isLoggedIn &&
              user &&
              showNotifications && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-[#2f9638]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification._id}
                          type="button"
                          onClick={() =>
                            handleNotificationClick(notification)
                          }
                          className={`w-full border-b border-gray-100 px-4 py-3 text-left ${
                            !notification.isRead
                              ? "bg-green-50/50"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead
                                  ? "bg-transparent"
                                  : "bg-[#2f9638]"
                              }`}
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-gray-600">
                                {notification.message}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-400">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

            {/* Mobile User */}
            {isLoggedIn && user ? (
              <div className="mt-5 space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700"
                >
                  {user.name}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full rounded-full bg-[#2f9638] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#267d2f] disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-5 block w-full rounded-full bg-[#2f9638] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#267d2f]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
      </header>
  </>
  );
}