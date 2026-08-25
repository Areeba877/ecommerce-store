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

// GET /api/cart
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

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return NextResponse.json(
        {
          message: "Cart fetched successfully.",
          cart: {
            items: [],
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Cart fetched successfully.",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      { message: "Server error while fetching cart." },
      { status: 500 }
    );
  }
}

// POST /api/cart
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be a positive integer." },
        { status: 400 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    return NextResponse.json(
      {
        message: "Product added to cart successfully.",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      { message: "Server error while adding product to cart." },
      { status: 500 }
    );
  }
}

// PUT /api/cart
export async function PUT(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

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

// DELETE /api/cart
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

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found." },
        { status: 404 }
      );
    }

    if (!productId) {
      cart.items = [];
      
      await cart.save();

      return NextResponse.json(
        {
          message: "Cart cleared successfully.",
          cart,
        },
        { status: 200 }
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
    console.error("Delete cart error:", error);

    return NextResponse.json(
      { message: "Server error while removing product from cart." },
      { status: 500 }
    );
  }
}