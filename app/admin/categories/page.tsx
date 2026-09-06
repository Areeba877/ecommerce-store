"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: string;
};

type CategoryForm = {
  name: string;
  description: string;
  image: string;
};

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  image: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (
    type: "success" | "error",
    message: string
  ) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/categories");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load categories."
        );
      }

      setCategories(data);
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast("error", "Category name is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";

      const method = editingId ? "PUT" : "POST";

      const slug = generateSlug(form.name);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug,
          description: form.description.trim(),
          image: form.image.trim(),
        }),
      });

      const text = await response.text();

      let data: {
        message?: string;
      } = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      showToast(
        "success",
        editingId
          ? "Category successfully updated."
          : "Category successfully added."
      );

      resetForm();
      await fetchCategories();
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let data: {
        message?: string;
      } = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category."
        );
      }

      showToast(
        "success",
        "Category successfully deleted."
      );

      await fetchCategories();
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to delete category."
      );
    }
  };

  const filteredCategories = categories.filter((category) => {
    const searchValue = search.toLowerCase().trim();

    return (
      category.name.toLowerCase().includes(searchValue) ||
      category.slug.toLowerCase().includes(searchValue) ||
      category.description
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed right-6 top-6 z-50 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>

            <p className="mt-1 text-gray-600">
              Manage your store categories.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              {editingId
                ? "Edit Category"
                : "Add New Category"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Category Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Category description"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="e.g. /products/category.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                />
              </div>

              {/* Slug Preview */}
              {form.name.trim() && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-600">
                    Slug
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {generateSlug(form.name)}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Add Category"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
          />
        </div>

        {/* Categories */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredCategories.length} categories found
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50"
                      >
                        {/* Category */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                No Image
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-gray-900">
                                {category.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-4">
                          <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-700">
                            {category.slug}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="max-w-xs px-6 py-4">
                          <p className="truncate text-sm text-gray-600">
                            {category.description ||
                              "No description"}
                          </p>
                        </td>

                        {/* Created */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.createdAt
                            ? new Date(
                                category.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(category)
                              }
                              className="rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  category._id
                                )
                              }
                              className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}