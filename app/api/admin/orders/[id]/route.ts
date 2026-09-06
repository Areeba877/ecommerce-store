import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";

const allowedStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).populate(
      "items.product",
      "name image price"
    );

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Order fetched successfully.",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch admin order error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("items.product", "name image price");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Order status updated successfully.",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update admin order error:", error);

    return NextResponse.json(
      { message: "Failed to update order status." },
      { status: 500 }
    );
  }
}