import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// GET all categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    console.log("Category POST body:", body);

    const category = await Category.create(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create category";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}