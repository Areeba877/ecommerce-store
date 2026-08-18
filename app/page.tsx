"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestOffers from "@/components/BestOffers";
import BestSellers from "@/components/BestSellers";

import Brands from "@/components/Brands";
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Gadget");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <Hero />

        <Categories
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <FeaturedProducts selectedCategory={selectedCategory} />
        <BestOffers />
        <BestSellers />
        <Brands />
      </main>

      <Footer />
    </>
  );
}