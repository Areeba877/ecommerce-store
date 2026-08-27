"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "../WishlistContext";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  image: string;
  category: string;
  name: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
};

type ApiProduct = {
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
};

export default function ShopPage() {
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");

  const productsPerPage = 8;

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productList: ApiProduct[] = Array.isArray(data)
          ? data
          : data.products || [];

        const formattedProducts: Product[] = productList.map((product) => ({
          // IMPORTANT:
          // Use MongoDB _id instead of old local IDs like "product-4"
          id: product._id,

          image: product.image,
          category: product.category,
          name: product.name,
          price: `$${product.price.toFixed(2)}`,

          oldPrice:
            product.oldPrice !== undefined
              ? `$${product.oldPrice.toFixed(2)}`
              : undefined,

          badge: product.badge,
          brand: product.brand,
          collection: product.collection,
          type: product.type,
          stock: product.stock,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Categories from MongoDB products
  const categories = useMemo(() => {
    const values = products.flatMap((product) =>
      product.category
        .split(",")
        .map((item) => item.trim())
    );

    return ["All", ...Array.from(new Set(values))];
  }, [products]);

  // Brands from MongoDB products
  const brands = useMemo(() => {
    const values = products
      .map((product) => product.brand)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(values))];
  }, [products]);

  // Search + Filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category
        .toLowerCase()
        .includes(selectedCategory.toLowerCase());

    const matchesBrand =
      selectedBrand === "All" ||
      product.brand === selectedBrand;

    const price = Number(
      String(product.price).replace(/[^0-9.]/g, "")
    );

    const matchesPrice =
      selectedPrice === "All" ||
      (selectedPrice === "Under 100" && price < 100) ||
      (selectedPrice === "100 - 500" &&
        price >= 100 &&
        price <= 500) ||
      (selectedPrice === "Above 500" && price > 500);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice
    );
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleWishlist = (
    productId: string,
    productName: string
  ) => {
    const alreadyAdded = isWishlisted(productId);

    toggleWishlist(productId);

    setMessage(
      alreadyAdded
        ? `${productName} removed from wishlist!`
        : "Product added successfully!"
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleAddToCart = (
    productId: string,
    productName: string
  ) => {
    // IMPORTANT:
    // productId is now MongoDB _id
    addToCart(productId);

    setMessage(`${productName} added to cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <>
      <Navbar />

      {/* Success Message */}
      {message && (
        <div className="fixed right-5 top-24 z-50 rounded-lg bg-[#155e4a] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {message}
        </div>
      )}

      <main className="min-h-screen bg-white px-5 pb-12 pt-2 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-10">
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              Explore all our products and find something you love
            </p>

            {/* Search */}
            <div className="mt-5 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm outline-none transition focus:border-[#155e4a]"
              />
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap gap-3">

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm outline-none focus:border-[#155e4a]"
              >
                <option value="All">All Categories</option>

                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              {/* Brand */}
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm outline-none focus:border-[#155e4a]"
              >
                <option value="All">All Brands</option>

                {brands
                  .filter((brand) => brand !== "All")
                  .map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
              </select>

              {/* Price */}
              <select
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm outline-none focus:border-[#155e4a]"
              >
                <option value="All">All Prices</option>
                <option value="Under 100">Under 100</option>
                <option value="100 - 500">100 - 500</option>
                <option value="Above 500">Above 500</option>
              </select>

            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Products */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {currentProducts.map((product) => {
                const wishlisted = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <div className="relative flex h-52 items-center justify-center bg-gray-50 p-2">

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute left-3 top-3 z-10 rounded-full border border-green-400 bg-white px-3 py-1 text-xs font-medium text-black">
                          {product.badge}
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        type="button"
                        onClick={() =>
                          handleWishlist(
                            product.id,
                            product.name
                          )
                        }
                        className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                          wishlisted
                            ? "bg-[#155e4a] text-white"
                            : "bg-white text-gray-700 hover:bg-[#155e4a] hover:text-white"
                        }`}
                        aria-label={
                          wishlisted
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                      >
                        <span className="text-xl">
                          {wishlisted ? "♥" : "♡"}
                        </span>
                      </button>

                      <Link
                        href={`/products/${product.id}`}
                        className="h-full w-full"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full cursor-pointer object-contain"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">

                      <p className="text-xs text-gray-400">
                        {product.category}
                      </p>

                      <Link
                        href={`/products/${product.id}`}
                      >
                        <h2 className="mt-1 truncate text-sm font-semibold text-black hover:text-[#155e4a]">
                          {product.name}
                        </h2>
                      </Link>

                      {/* Rating */}
                      <div className="mt-2 text-sm text-green-500">
                        ★★★★★
                      </div>

                      {/* Price */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-black">
                          {product.price}
                        </span>

                        {product.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.oldPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            product.id,
                            product.name
                          )
                        }
                        className="mt-4 w-full rounded-full bg-[#155e4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4939]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            currentProducts.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  No products found.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

          {/* Pagination */}
          {!loading &&
            !error &&
            totalPages > 0 && (
              <div className="mt-10 flex items-center justify-center gap-2">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-full text-sm font-semibold ${
                      currentPage === page
                        ? "bg-[#155e4a] text-white"
                        : "border border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}