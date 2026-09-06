"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
}

interface ProductForm {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  image: string;
  badge: string;
  brand: string;
  collection: string;
  type: string;
  stock: string;
}

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  image: "",
  badge: "",
  brand: "",
  collection: "",
  type: "",
  stock: "Available",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function showSuccess(text: string) {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function showError(text: string) {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      oldPrice: product.oldPrice?.toString() || "",
      image: product.image || "",
      badge: product.badge || "",
      brand: product.brand || "",
      collection: product.collection || "",
      type: product.type || "",
      stock: product.stock || "Available",
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name ||
      !form.category ||
      !form.price ||
      !form.image
    ) {
      showError("Name, category, price and image are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        oldPrice: form.oldPrice
          ? Number(form.oldPrice)
          : undefined,
        image: form.image,
        badge: form.badge || undefined,
        brand: form.brand || undefined,
        collection: form.collection || undefined,
        type: form.type || undefined,
        stock: form.stock || "Available",
      };

      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let data: { message?: string; product?: Product } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${editingId ? "update" : "create"} product`
        );
      }

      await loadProducts();

      closeForm();

      showSuccess(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );
    } catch (error) {
      console.error(error);

      showError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeleting(productId);
      setError("");

      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let data: { message?: string } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );

      showSuccess("Product deleted successfully.");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
    } finally {
      setDeleting("");
    }
  }

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue) ||
      product.brand?.toLowerCase().includes(searchValue)
    );
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-[#123b2a]">
            Product Management
          </h1>

          <p className="mt-4 text-gray-600">
            Loading products...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gray-50 p-8">
      {message && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-lg">
          <p className="font-medium text-green-700">
            ✓ {message}
          </p>
        </div>
      )}

      {error && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-lg">
          <p className="font-medium text-red-600">
            ! {error}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#123b2a]">
              Product Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage ShopCart products.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-[#064e3b] px-5 py-3 font-medium text-white hover:bg-[#053c2e]"
          >
            + Add Product
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#123b2a]">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <button
                onClick={closeForm}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category *
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price *
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="99.99"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Old Price
                  </label>
                  <input
                    name="oldPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.oldPrice}
                    onChange={handleChange}
                    placeholder="129.99"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Image URL *
                  </label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="/products/product.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Collection
                  </label>
                  <input
                    name="collection"
                    value={form.collection}
                    onChange={handleChange}
                    placeholder="Collection"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Type
                  </label>
                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Type"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Badge
                  </label>
                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    placeholder="New / Sale / Hot"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#064e3b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Stock
                  </label>

                  <select
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#064e3b]"
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">
                      Out of Stock
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#064e3b] px-6 py-3 font-medium text-white hover:bg-[#053c2e] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, category or brand..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#064e3b]"
          />
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            {search ? "Search Results" : "Total Products"}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#064e3b]">
            {filteredProducts.length}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            {filteredProducts.length > 0 ? (
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Badge</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />

                          <div>
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>

                            {product.type && (
                              <p className="text-xs text-gray-500">
                                {product.type}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.brand || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#064e3b]">
                          ${product.price.toFixed(2)}
                        </p>

                        {product.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ${product.oldPrice.toFixed(2)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.stock === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock || "Available"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.badge || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              openEditForm(product)
                            }

className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
>
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product._id)
                            }
                            disabled={
                              deleting === product._id
                            }
className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"                          >
                            {deleting === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-gray-500">
                {search
                  ? "No products found for this search."
                  : "No products found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}