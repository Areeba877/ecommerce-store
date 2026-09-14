import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

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

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    if (collection) {
      filter.collection = collection;
    }

    if (type) {
      filter.type = type;
    }

    if (stock === "Available") {
      filter.stock = { $gt: 0 };
    } else if (stock === "Out of Stock") {
      filter.stock = 0;
    } else if (stock && !Number.isNaN(Number(stock))) {
      filter.stock = Number(stock);
    }

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

    const totalProducts = await Product.countDocuments(filter);

    if (!pageParam && !limitParam) {
      const products = await Product.find(filter).sort({
        createdAt: -1,
      });

      return NextResponse.json(
        {
          products,
          pagination: {
            currentPage: 1,
            limit: totalProducts,
            totalProducts,
            totalPages: totalProducts > 0 ? 1 : 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        { status: 200 }
      );
    }

    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.max(Number(limitParam) || 6, 1);

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
      {
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    if (
      body.stock === undefined ||
      !Number.isInteger(Number(body.stock)) ||
      Number(body.stock) < 0
    ) {
      return NextResponse.json(
        { message: "Stock must be a non-negative whole number." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      category: body.category,
      price: Number(body.price),
      oldPrice:
        body.oldPrice !== undefined
          ? Number(body.oldPrice)
          : undefined,
      image: body.image,
      badge: body.badge,
      brand: body.brand,
      collection: body.collection,
      type: body.type,
      stock: Number(body.stock),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST product error:", error);

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}