import Link from "next/link";
import { products } from "../../components/products";
export default function OffersPage() {
  return (
    <main className="min-h-screen bg-[#f7fff3]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#155e4a] via-[#2f9638] to-[#155e4a] px-5 py-16 text-center sm:py-20">

        {/* Dots */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="relative z-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
            Limited Time Deals
          </p>

          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
            Best{" "}
            <span className="text-[#d9ff4f]">
              Offers
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Grab your favorite products at amazing prices before these deals
            disappear.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex rounded-full bg-[#d9ff4f] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#155e4a] transition hover:bg-white"
          >
            Shop All Products →
          </Link>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2f9638]">
            Special Deals
          </p>

          <h2 className="mt-1 text-3xl font-black text-[#155e4a]">
            All Best Offers
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {products.length} products available
          </p>
        </div>

        {/* 21 PRODUCTS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-[#e1eee0] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* BADGE */}
              <div className="absolute left-3 top-3 z-10">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold text-white ${
                    product.badge?.toLowerCase().includes("sale")
                      ? "bg-[#2f9638]"
                      : "bg-[#155e4a]"
                  }`}
                >
                  {product.badge}
                </span>
              </div>

              {/* IMAGE */}
              <div className="flex h-[210px] items-center justify-center bg-[#f5fbf2] p-5 sm:h-[240px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* INFO */}
              <div className="p-4">

                {/* Category */}
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#2f9638]">
                  {product.category.split(",")[0]}
                </p>

                {/* Name */}
                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-[#155e4a]">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-black text-[#2f9638]">
                    {product.price}
                  </span>

                  <span className="text-xs text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                </div>

                {/* Button */}
                <Link
                  href={`/shop/${product.id}`}
                  className="mt-4 block rounded-full bg-[#155e4a] py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#2f9638]"
                >
                  View Product
                </Link>

              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}