"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

function OrdersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M6 4h12v16H6z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!data.authenticated || !data.user) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        setName(data.user.name);
      } catch (error) {
        console.error("Profile fetch error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleEditProfile = () => {
    if (!user) {
      return;
    }

    setName(user.name);
    setProfileMessage("");
    setProfileError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setName(user.name);
    }

    setProfileMessage("");
    setProfileError("");
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    setProfileMessage("");
    setProfileError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileError("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError("Name must be at least 2 characters long.");
      return;
    }

    if (trimmedName.length > 50) {
      setProfileError("Name must be less than 50 characters.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.message || "Failed to update profile.");
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setProfileMessage(data.message);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.name.split(" ")[0];

  return (
    <main className="min-h-screen bg-white px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-[650px]">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-[30px] font-bold tracking-tight text-gray-900 sm:text-[34px]">
            Welcome, {firstName}
          </h1>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* My Orders */}
          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-5 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4f5] text-gray-700">
                <OrdersIcon />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-900">
                  My Orders
                </p>

                <p className="mt-0.5 text-[12px] text-gray-500">
                  Track and review past purchases
                </p>
              </div>
            </div>

            <span className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </button>

          {/* My Wishlist */}
          <button
            type="button"
            onClick={() => router.push("/wishlist")}
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-5 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4f5] text-gray-700">
                <HeartIcon />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-900">
                  My Wishlist
                </p>

                <p className="mt-0.5 text-[12px] text-gray-500">
                  Items you've saved for later
                </p>
              </div>
            </div>

            <span className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </button>
        </div>

        {/* User Details */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6">

          {/* Name */}
          <div className="flex items-center justify-between border-b border-gray-100 py-5">
            <p className="text-[13px] text-gray-500">
              Full name
            </p>

            {!isEditing ? (
              <p className="text-[13px] font-medium text-gray-900">
                {user.name}
              </p>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
                className="ml-5 w-[60%] rounded-lg border border-gray-200 px-3 py-2 text-right text-[13px] text-gray-900 outline-none focus:border-[#123b2a]"
              />
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between border-b border-gray-100 py-5">
            <p className="text-[13px] text-gray-500">
              Email
            </p>

            <p className="ml-5 break-all text-right text-[13px] font-medium text-gray-900">
              {user.email}
            </p>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-5">
            <p className="text-[13px] text-gray-500">
              Role
            </p>

            <p className="text-[13px] font-medium uppercase text-gray-900">
              {user.role}
            </p>
          </div>

          {/* Profile Messages */}
          {profileMessage && (
            <p className="mb-4 text-center text-xs text-green-600">
              {profileMessage}
            </p>
          )}

          {profileError && (
            <p className="mb-4 text-center text-xs text-red-600">
              {profileError}
            </p>
          )}

          {/* Edit / Save / Cancel */}
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEditProfile}
className="mb-3 w-full rounded-full bg-[#176b55] px-5 py-3 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#125b48]"
            >
              Edit Profile
            </button>
          ) : (
            <div className="mb-3 flex gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="w-1/2 rounded-full border border-gray-200 bg-white px-5 py-3 text-[13px] font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
className="w-1/2 rounded-full bg-[#176b55] px-5 py-3 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#125b48] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mb-6 w-full rounded-full bg-[#176b55] px-5 py-3 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#125b48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>

      </div>
    </main>
  );
}