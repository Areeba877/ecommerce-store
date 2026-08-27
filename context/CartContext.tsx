"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
};

type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartQuantity: (productId: string) => number;
  getCartTotal: () => number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setCartItems([]);
        return;
      }

      const data = await response.json();

      const items = (data.cart?.items || []).map(
        (item: {
          product: Product;
          quantity: number;
        }) => ({
          productId: item.product._id,
          quantity: item.quantity,
          product: item.product,
        })
      );

      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (
    productId: string,
    quantity: number = 1
  ) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      await refreshCart();
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove product");
      }

      await refreshCart();
    } catch (error) {
      console.error("Remove from cart error:", error);
      throw error;
    }
  };

  const increaseQuantity = async (productId: string) => {
    const item = cartItems.find(
      (item) => item.productId === productId
    );

    if (!item) return;

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: item.quantity + 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to increase quantity"
        );
      }

      await refreshCart();
    } catch (error) {
      console.error("Increase quantity error:", error);
      throw error;
    }
  };

  const decreaseQuantity = async (productId: string) => {
    const item = cartItems.find(
      (item) => item.productId === productId
    );

    if (!item) return;

    if (item.quantity === 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: item.quantity - 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to decrease quantity"
        );
      }

      await refreshCart();
    } catch (error) {
      console.error("Decrease quantity error:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to clear cart");
      }

      setCartItems([]);
    } catch (error) {
      console.error("Clear cart error:", error);
      throw error;
    }
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(
      (item) => item.productId === productId
    );

    return item?.quantity ?? 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartQuantity,
        getCartTotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}