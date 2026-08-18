import Link from "next/link";
import {
  SiHp,
  SiApple,
  SiHitachi,
  SiHuawei,
  SiIkea,
  SiSony,
} from "react-icons/si";

import {
  Truck,
  Repeat2,
  Headset,
  ShieldCheck,
} from "lucide-react";

const brands = [
  {
    name: "Hi-Tech",
    logo: (
      <span className="text-2xl font-extrabold tracking-tight text-red-600">
        Hi<span className="text-gray-900"> tech</span>
      </span>
    ),
  },
  {
    name: "HP",
    logo: <SiHp className="text-[68px] text-[#0755a5]" />,
  },
  {
    name: "Apple",
    logo: <SiApple className="text-[62px] text-gray-800" />,
  },
  {
    name: "A4Tech",
    logo: (
      <span className="text-2xl font-black tracking-tight text-gray-900">
        A4TECH
      </span>
    ),
  },
  {
    name: "Hitachi",
    logo: <SiHitachi className="text-[70px] text-red-600" />,
  },
  {
    name: "Huawei",
    logo: <SiHuawei className="text-[70px] text-red-600" />,
  },
  {
    name: "IKEA",
    logo: <SiIkea className="text-[70px] text-[#0058a3]" />,
  },
  {
    name: "Sony",
    logo: <SiSony className="text-[70px] text-black" />,
  },
];

const features = [
  {
    icon: <Truck size={48} strokeWidth={2} />,
    title: "Free Delivery",
    description: "Free shipping over $100",
  },
  {
    icon: <Repeat2 size={48} strokeWidth={2} />,
    title: "Free Return",
    description: "Free shipping over $100",
  },
  {
    icon: <Headset size={48} strokeWidth={2} />,
    title: "Customer Support",
    description: "Friendly 27/7 customer support",
  },
  {
    icon: <ShieldCheck size={48} strokeWidth={2} />,
    title: "Money Back Guarantee",
    description: "Quality checked by our team",
  },
];

export default function Brands() {
  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1280px] rounded-xl bg-[#f7f7f9] px-6 py-8 sm:px-8 lg:px-7">

        {/* Header */}
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shop By Brands
          </h2>

          {/* View All */}
          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold text-black underline underline-offset-4 transition-colors hover:text-[#2f9638]"
          >
            View all
          </Link>
        </div>

        {/* Brands */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href="/shop"
              aria-label={`Shop ${brand.name}`}
              className="flex h-24 items-center justify-center rounded-lg bg-white px-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {brand.logo}
            </Link>
          ))}
        </div>

        {/* Features */}
<div className="mt-10 grid grid-cols-1 border border-[#e5e9e5] sm:grid-cols-2 lg:grid-cols-4">
  {features.map((feature, index) => (
    <div
      key={feature.title}
      className={`group flex items-center gap-4 px-8 py-8 ${

      index !== 0
          ? "border-t border-[#e5e9e5] sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <div
        className="
          flex-shrink-0
           text-[48px]i
          text-gray-600
          transition-all
          duration-300
          ease-out
          group-hover:-translate-y-1
          group-hover:text-[#2f9638]
        "
      >
        {feature.icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          {feature.title}
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {feature.description}
        </p>
      </div>
    </div>
  ))}
</div>
   
      </div>
    </section>
  );
}