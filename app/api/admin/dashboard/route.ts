import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized. Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: {
            $in: ["processing", "shipped", "delivered"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "_id customerName customerEmail total paymentMethod status createdAt"
      )
      .lean();

    return NextResponse.json(
      {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      {
        message: "Failed to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}