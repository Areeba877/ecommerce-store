import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ApiProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();

    const product: ApiProduct = data.product || data;

    if (!product || !product._id) {
      notFound();
    }

    return (
      <>
        <Navbar />

        <ProductDetails product={product} />

        <Footer />
      </>
    );
  } catch (error) {
    console.error("Product detail fetch error:", error);
    notFound();
  }
}