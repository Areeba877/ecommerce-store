import { NextResponse } from "next/server";

import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      statusResult,
      paymentResult,
      dailyResult,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),

      Order.aggregate([
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
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),

      Order.aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        {
          $sort: { revenue: -1 },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json(
      {
        message: "Analytics fetched successfully.",
        analytics: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          averageOrderValue,
          ordersByStatus: statusResult,
          payments: paymentResult,
          dailySales: dailyResult,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { message: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}