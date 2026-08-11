import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to ShopCart
            </h1>

            <p className="mt-4 text-gray-600">
              Your modern shopping experience starts here.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}