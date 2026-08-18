import { notFound } from "next/navigation";
import { products } from "@/components/products";
import ProductDetails from "@/components/ProductDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find(
    (item) => item.id === id
  );

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <ProductDetails product={product} />

      <Footer />
    </>
  );
}