"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: string | null;
};

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (category.slug === "clothes") {
      router.push("/shop?category=2%20Piece%20Suits");
      return;
    }

    router.push(`/shop?category=${encodeURIComponent(category.name)}`);
  };

  if (loading) {
    return (
      <section className="bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-gray-500">
            Loading categories...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
  <h2 className="text-5xl font-bold text-gray-900">
    Shop by Category
  </h2>

  <p className="mt-3 text-semibold text-gray-500">
    Explore our collections and find exactly what you’re looking for.
  </p>
</div>

<button
  onClick={() => setShowAll(!showAll)}
  className="rounded-full border border-gray-900 px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white"
>
  {showAll ? "Show less" : "See all"}
</button>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          
{categories
  .filter((category) => !category.parent)
  .filter(
    (category) =>
      showAll || 
      ["clothes", "beauty", "shoes", "bags"].includes(category.slug)
  )
  .map((category) => (

              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {category.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}