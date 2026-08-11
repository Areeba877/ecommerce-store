import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <Hero />
      </main>

      <Footer />
    </>
  );
}