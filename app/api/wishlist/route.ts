import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

async function getUserId(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const token = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return payload.userId as string;
  } catch {
    return null;
  }
}

// GET /api/wishlist
export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    if (!wishlist) {
      return NextResponse.json(
        {
          message: "Wishlist fetched successfully.",
          wishlist: {
            products: [],
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Wishlist fetched successfully.",
        wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get wishlist error:", error);

    return NextResponse.json(
      { message: "Server error while fetching wishlist." },
      { status: 500 }
    );
  }
}

// POST /api/wishlist
export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (alreadyExists) {
        return NextResponse.json(
          {
            message: "Product is already in wishlist.",
            wishlist: await wishlist.populate("products"),
          },
          { status: 200 }
        );
      }

      wishlist.products.push(productId);

      await wishlist.save();
    }

    await wishlist.populate("products");

    return NextResponse.json(
      {
        message: "Product added to wishlist successfully.",
        wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add wishlist error:", error);

    return NextResponse.json(
      { message: "Server error while adding product to wishlist." },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    await connectDB();

    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found." },
        { status: 404 }
      );
    }

    if (!productId) {
      wishlist.products = [];

      await wishlist.save();

      return NextResponse.json(
        {
          message: "Wishlist cleared successfully.",
          wishlist,
        },
        { status: 200 }
      );
    }

    const productExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (!productExists) {
      return NextResponse.json(
        { message: "Product not found in wishlist." },
        { status: 404 }
      );
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    return NextResponse.json(
      {
        message: "Product removed from wishlist successfully.",
        wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete wishlist error:", error);

    return NextResponse.json(
      { message: "Server error while removing product from wishlist." },
      { status: 500 }
    );
  }
}