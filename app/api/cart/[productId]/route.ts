import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

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

// PUT /api/cart/[productId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be a positive integer." },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found." },
        { status: 404 }
      );
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { message: "Product not found in cart." },
        { status: 404 }
      );
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json(
      {
        message: "Cart quantity updated successfully.",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update cart error:", error);

    return NextResponse.json(
      { message: "Server error while updating cart." },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[productId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const { productId } = await params;

    await connectDB();

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found." },
        { status: 404 }
      );
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return NextResponse.json(
        { message: "Product not found in cart." },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json(
      {
        message: "Product removed from cart successfully.",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove from cart error:", error);

    return NextResponse.json(
      { message: "Server error while removing product from cart." },
      { status: 500 }
    );
  }
}