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
        { message: "Admin authorization required." },
        { status: 403 }
      );
    }

await connectDB();

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      statusStats,
      paymentStats,
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
          $sort: { count: -1 },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json(
      {
        message: "Statistics fetched successfully.",
        statistics: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          averageOrderValue,
          ordersByStatus: statusStats.map((item) => ({
            status: item._id || "unknown",
            count: item.count,
          })),
          payments: paymentStats.map((item) => ({
            method: item._id || "unknown",
            count: item.count,
            revenue: item.revenue || 0,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin statistics error:", error);

    return NextResponse.json(
      { message: "Failed to fetch statistics." },
      { status: 500 }
    );
  }
}