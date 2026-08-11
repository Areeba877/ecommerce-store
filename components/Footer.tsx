import Link from "next/link";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Hot Deal", href: "/deals" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#f8faf8]">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-block text-[25px] font-extrabold tracking-tight"
            >
              <span className="text-[#123b2a] transition-colors duration-300 group-hover:text-[#2f9638]">
                SHOPCAR
              </span>
              <span className="text-[#2f9638] transition-colors duration-300 group-hover:text-[#123b2a]">
                T
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
              Discover quality products and enjoy a simple, modern shopping
              experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Categories
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/Mobiles"
                  className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                >
                  Mobiles
                </Link>
              </li>

              <li>
                <Link
                  href="/Appliances"
                  className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                >
                  Appliances
                </Link>
              </li>

              <li>
                <Link
                  href="/Smartphones"
                  className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                >
                  Smartphones
                </Link>
              </li>

               <li>
                <Link
                  href="/Kitchen Appliances"
                  className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                >
                  Kitchen Appliances
                </Link>
              </li>

                <li>
                <Link
                  href="/Air Conditioners
"
                  className="text-sm text-gray-600 transition-colors hover:text-[#2f9638]"
                >
                  Air Conditioners

                </Link>
              </li>
            </ul>
          </div>


{/* Follow */}
<div>
  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
    Follow
  </h3>

  <div className="mt-5 flex items-center gap-5">
    <a
      href="#"
      aria-label="Instagram"
      className="text-gray-500 transition-colors hover:text-[#2f9638]"
    >
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
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </a>

    <a
      href="#"
      aria-label="Facebook"
      className="text-gray-500 transition-colors hover:text-[#2f9638]"
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
      </svg>
    </a>

    <a
  href="#"
  aria-label="Twitter"
  className="text-gray-500 transition-colors hover:text-[#2f9638]"
>
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23 3.01a9.5 9.5 0 0 1-2.64.72A4.6 4.6 0 0 0 22.38 1.2a9.2 9.2 0 0 1-2.92 1.12A4.6 4.6 0 0 0 11.54 6.5c0 .36.04.72.12 1.04A13.05 13.05 0 0 1 2.17 1.84a4.6 4.6 0 0 0 1.42 6.14 4.55 4.55 0 0 1-2.08-.57v.06a4.6 4.6 0 0 0 3.69 4.51 4.6 4.6 0 0 1-2.07.08 4.6 4.6 0 0 0 4.3 3.19A9.23 9.23 0 0 1 1.7 17.2c-.38 0-.76-.02-1.13-.07A13 13 0 0 0 7.62 19c8.28 0 12.8-6.86 12.8-12.8 0-.2 0-.39-.01-.58A9.15 9.15 0 0 0 23 3.01Z" />
  </svg>
</a>
  </div>
</div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026 ShopCart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}