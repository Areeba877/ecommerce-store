
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
};

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Categories fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    router.push(
      `/shop?category=${encodeURIComponent(category.name)}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h1>

            <p className="mt-2 text-sm text-gray-500">
 Explore our thoughtfully curated collections. Discover
            everything you need, all in one place.
                        </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[275px] animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          )}

          {/* No categories */}
          {!loading && categories.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No categories found.
              </p>
            </div>
          )}

          {/* CATEGORY CARDS */}
          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="h-[190px] w-full overflow-hidden bg-gray-100">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="px-4 py-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {category.description ||
                        `${category.name} collection`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

