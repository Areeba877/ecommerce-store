import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import User from "@/models/User";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (role !== "user" && role !== "admin") {
      return NextResponse.json(
        {
          message: "Invalid role.",
        },
        { status: 400 }
      );
    }

    // Admin apna khud ka admin role remove nahi kar sakta
    if (id === admin.userId && role === "user") {
      return NextResponse.json(
        {
          message: "You cannot remove your own admin role.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("_id name email role isVerified createdAt")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User role updated successfully.",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user role error:", error);

    return NextResponse.json(
      {
        message: "Failed to update user role.",
      },
      { status: 500 }
    );
  }
}