const benefits = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: "↩",
    title: "Easy Returns",
    description: "Hassle-free returns",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    description: "We're here to help",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className={`flex items-center gap-4 px-6 py-7 ${
              index !== benefits.length - 1
                ? "border-b border-gray-200 lg:border-b-0 lg:border-r"
                : ""
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef8f0] text-2xl">
              {benefit.icon}
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">
                {benefit.title}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}