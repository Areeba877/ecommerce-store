export default function Hero() {
  return (
    <section className="bg-white px-6 py-8">
      <div className="mx-auto flex min-h-[420px] max-w-7xl items-center overflow-hidden rounded-2xl bg-[#fff1e4]">

        {/* Left Content */}
        <div className="w-full px-8 py-14 sm:px-12 lg:w-1/2 lg:px-16">

          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-700">
            Welcome to ShopCart
          </p>

          <h1 className="max-w-lg text-2xl font-bold leading-tight text-[#064e3b] sm:text-5xl lg:text-5xl">
            Shop Smart.
            <br />
            Live Better.
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
            Discover quality products at great prices.
            Find everything you need for your everyday
            lifestyle, all in one place.
          </p>

          <button className="mt-7 rounded-md bg-[#155e4a] px-7 py-3 font-semibold text-white transition hover:bg-[#0f4939]">
            Shop Now
          </button>

        </div>

        {/* Right Image */}
        <div className="hidden h-full w-1/2 items-end justify-center lg:flex">
          <img
            src="/hero-image.png"
            alt="ShopCart"
            className="h-[400px] w-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
}