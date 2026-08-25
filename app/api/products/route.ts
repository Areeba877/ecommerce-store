import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET products + search + filters + pagination
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const collection = searchParams.get("collection");
    const type = searchParams.get("type");
    const stock = searchParams.get("stock");

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.max(Number(searchParams.get("limit")) || 6, 1);

    const filter: Record<string, unknown> = {};

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Category
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // Brand
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Other filters
    if (collection) {
      filter.collection = collection;
    }

    if (type) {
      filter.type = type;
    }

    if (stock) {
      filter.stock = stock;
    }

    // Price filter
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};

      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }

      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }

      filter.price = priceFilter;
    }

    // Total products matching filters
    const totalProducts = await Product.countDocuments(filter);

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        products,
        pagination: {
          currentPage: page,
          limit,
          totalProducts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}