import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Heart,
  Headphones,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <main className="min-h-screen bg-white text-[#123b2a]">
        {/* Hero Section */}
        <section className="border-b border-gray-100 bg-white">
<div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
                <div className="mx-auto max-w-3xl text-center">
             

              <h1 className="text-3xl font-bold tracking-tight text-[#123b2a] sm:text-5xl lg:text-5xl">
                About Shopcart
              </h1>

              <p className="mx-auto mt-6 max-w-1xl text-base leading-8 text-gray-600 sm:text-lg">
                ShopCart is your trusted online shopping destination where
                quality products, great prices, and a simple shopping
                experience come together.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-[#f8faf8]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            {/* Image */}
         
<div className="overflow-hidden rounded-3xl bg-white shadow-sm">
  <img
    src="/products/aboutmain.png"
    alt="ShopCart shopping collection"
    className="h-[400px] w-full object-cover"
  />
</div>

            {/* Content */}
            <div>
            
              <h2 className="text-3xl font-bold text-[#123b2a] sm:text-4xl">
                Everything You Need,
                <br />
                All in One Place
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                At ShopCart, we believe online shopping should be easy,
                convenient, and enjoyable. Our goal is to bring a wide range
                of useful and stylish products together so you can find what
                you need without the hassle.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                From everyday essentials to products that make your lifestyle
                better, we carefully focus on providing a smooth shopping
                experience from browsing to checkout.
              </p>

              <div className="mt-8">
                <a
                  href="/products"
                  className="inline-flex items-center rounded-lg bg-[#123b2a] px-6 py-3 font-semibold text-white transition hover:bg-[#267d2f]"
                >
                  Start Shopping
                  <ShoppingBag className="ml-2" size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why ShopCart */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[#2f9638]">
                Why ShopCart
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#123b2a] sm:text-4xl">
Our Core values
                 </h2>

              <p className="mt-4 leading-7 text-gray-600">
                We focus on making every part of your shopping journey
                convenient and reliable.
              </p>
            </div>

 {/* 4 Cards */}
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {/* Wide Selection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#2f9638]">
          <ShoppingBag size={24} strokeWidth={1.8} />
        </div>

        <h3 className="mt-6 text-lg font-bold text-[#123b2a]">
          Wide Selection
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Explore different categories and discover products for your
          everyday needs.
        </p>
      </div>

      {/* Trusted Shopping */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#2f9638]">
          <ShieldCheck size={24} strokeWidth={1.8} />
        </div>

        <h3 className="mt-6 text-lg font-bold text-[#123b2a]">
          Trusted Shopping
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We aim to provide a secure and dependable shopping experience
          for every customer.
        </p>
      </div>

      {/* Easy Delivery */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#2f9638]">
          <Truck size={24} strokeWidth={1.8} />
        </div>

        <h3 className="mt-6 text-lg font-bold text-[#123b2a]">
          Easy Delivery
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We make the ordering process simple so your shopping experience
          stays hassle-free.
        </p>
      </div>

      {/* Customer First */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#2f9638]">
          <Headphones size={24} strokeWidth={1.8} />
        </div>

        <h3 className="mt-6 text-lg font-bold text-[#123b2a]">
          Customer First
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your satisfaction matters to us, and we continuously work to
          improve your experience.
        </p>
      </div>

    </div>
  </div>
</section>

           

        {/* Bottom Benefits */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 px-6 py-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            <div className="flex items-center justify-center gap-3 py-5 sm:py-3">
              <ShieldCheck className="text-[#2f9638]" size={24} />
              <span className="font-semibold text-[#123b2a]">
                Secure Shopping
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-5 sm:py-3">
              <Truck className="text-[#2f9638]" size={24} />
              <span className="font-semibold text-[#123b2a]">
                Convenient Delivery
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-5 sm:py-3">
              <Heart className="text-[#2f9638]" size={24} />
              <span className="font-semibold text-[#123b2a]">
                Customer Focused
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}