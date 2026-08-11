import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <Hero />
        <Categories />
      </main>

      <Footer />
    </>
  );
}