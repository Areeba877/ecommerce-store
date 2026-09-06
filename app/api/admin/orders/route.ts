import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const searchConditions: Record<string, unknown>[] = [
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i",
          },
        },
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({
          _id: new mongoose.Types.ObjectId(search),
        });
      }

      query.$or = searchConditions;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");

    return NextResponse.json(
      {
        message: "Admin orders fetched successfully.",
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch admin orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch admin orders." },
      { status: 500 }
    );
  }
}