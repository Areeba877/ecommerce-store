"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/components/products";
import { useWishlist } from "../WishlistContext";
import { useState } from "react";

export default function ShopPage() {
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleWishlist = (productId: string, productName: string) => {
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
          </div>

          {/* Products */}
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
                        handleWishlist(product.id, product.name)
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

                    <Link href={`/products/${product.id}`}>
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

                      <span className="text-xs text-gray-400 line-through">
                        {product.oldPrice}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      className="mt-4 w-full rounded-full bg-[#155e4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4939]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
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
              onClick={() => setCurrentPage((page) => page + 1)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}