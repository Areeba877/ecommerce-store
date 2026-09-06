"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

  async function loadUsers(searchValue = "") {
    try {
      setSearching(true);
      setError("");

      const response = await fetch(
        `/api/admin/users?search=${encodeURIComponent(searchValue)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(
    userId: string,
    newRole: "user" | "admin"
  ) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const text = await response.text();

      let data: { message?: string; user?: User } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

   if (!response.ok) {
  setErrorMessage(
    data.message ||
      `Failed to update user role. Status: ${response.status}`
  );

  setTimeout(() => {
    setErrorMessage("");
  }, 3000);

  return;
}

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      setSuccessMessage(
        newRole === "admin"
          ? "User promoted to admin successfully."
          : "User changed to normal user successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
   } catch (error) {
  console.error("Role update error:", error);

  setErrorMessage("Something went wrong while updating the role.");

  setTimeout(() => {
    setErrorMessage("");
  }, 3000);
}
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadUsers(search);
  }

  function handleClearSearch() {
    setSearch("");
    loadUsers("");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-[#123b2a]">
            User Management
          </h1>

          <p className="mt-4 text-gray-600">
            Loading users...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-[#123b2a]">
            User Management
          </h1>

          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>

          <button
            onClick={() => loadUsers(search)}
            className="mt-4 rounded-lg bg-[#064e3b] px-5 py-2 font-medium text-white hover:bg-[#053b2d]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gray-50 p-8">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            ✓
          </div>

          <p className="text-sm font-medium text-gray-800">
            {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
  <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-lg">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
      !
    </div>

    <p className="text-sm font-medium text-gray-800">
      {errorMessage}
    </p>
  </div>
)}

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#123b2a]">
            User Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage ShopCart users and their roles.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
          />

          <button
            type="submit"
            disabled={searching}
            className="rounded-lg bg-[#064e3b] px-6 py-3 font-medium text-white hover:bg-[#053b2d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching ? "Searching..." : "Search"}
          </button>

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </form>

        {/* Total Users */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            {search ? "Search Results" : "Total Users"}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#064e3b]">
            {users.length}
          </p>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            {users.length > 0 ? (
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as "user" | "admin"
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Verification */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.isVerified
                            ? "Verified"
                            : "Not Verified"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role === "admin"
                                ? "user"
                                : "admin"
                            )
                          }
                          className="rounded-lg bg-[#064e3b] px-4 py-2 text-sm font-medium text-white hover:bg-[#053b2d]"
                        >
                          {user.role === "admin"
                            ? "Make User"
                            : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  {search
                    ? "No users found for this search."
                    : "No users found."}
                </p>

                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 rounded-lg bg-[#064e3b] px-5 py-2 font-medium text-white hover:bg-[#053b2d]"
                  >
                    Show All Users
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}