"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Hot Deals", href: "/deals" },
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
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
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
      <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 8 4a5.1 5.1 0 0 1 4 2.1A5.1 5.1 0 0 1 16 4a4.7 4.7 0 0 1 4.8 4.7Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
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
      width="24"
      height="24"
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-3">

        {/* Logo */}
        <Link
  href="/"
  className="group text-[23px] font-extrabold tracking-tight"
>
  <span className="text-[#123b2a] transition-colors duration-300 group-hover:text-[#2f9638]">
    SHOPCAR
  </span>
  <span className="text-[#2f9638] transition-colors duration-300 group-hover:text-[#123b2a]">
    T
  </span>
</Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-7 text-[15px] font-semibold transition-colors ${
                index === 0
                  ? "text-[#2f9638]"
                  : "text-gray-600 hover:text-[#2f9638]"
              }`}
            >
              {link.name}

              {index === 0 && (
                <span className="absolute bottom-[13px] left-0 h-[2px] w-full rounded-full bg-[#2f9638]" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="text-gray-600 transition-colors hover:text-[#2f9638]"
          >
            <SearchIcon />
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Shopping cart"
            className="relative text-gray-600 transition-colors hover:text-[#2f9638]"
          >
            <ShoppingBagIcon />

            <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[9px] font-bold text-white">
              0
            </span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist"
            className="relative text-gray-600 transition-colors hover:text-[#2f9638]"
          >
            <HeartIcon />

            <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[9px] font-bold text-white">
              0
            </span>
          </button>

          {/* Login */}
          <Link
            href="/login"
            className="text-[15px] font-semibold text-gray-700 transition-colors hover:text-[#2f9638]"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-sm md:hidden">
          <div className="flex flex-col">

            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`border-b border-gray-100 py-4 text-[15px] font-semibold ${
                  index === 0
                    ? "text-[#2f9638]"
                    : "text-gray-700 hover:text-[#2f9638]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-5 border-b border-gray-100 py-4">
              <button
                type="button"
                aria-label="Search"
                className="text-gray-600 hover:text-[#2f9638]"
              >
                <SearchIcon />
              </button>

              <button
                type="button"
                aria-label="Shopping cart"
                className="relative text-gray-600 hover:text-[#2f9638]"
              >
                <ShoppingBagIcon />

                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[9px] font-bold text-white">
                  0
                </span>
              </button>

              <button
                type="button"
                aria-label="Wishlist"
                className="relative text-gray-600 hover:text-[#2f9638]"
              >
                <HeartIcon />

                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2f9638] px-1 text-[9px] font-bold text-white">
                  0
                </span>
              </button>
            </div>

            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 rounded-lg bg-[#2f9638] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#267d2f]"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}