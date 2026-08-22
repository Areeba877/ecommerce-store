"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { products } from "@/components/products";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  getCartQuantity: (productId: string) => number;
  getCartTotal: () => number;
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

  const addToCart = (productId: string) => {
    setCartItems((current) => {
      const existingItem = current.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        return current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          productId,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) =>
      current.filter((item) => item.productId !== productId)
    );
  };

  const increaseQuantity = (productId: string) => {
    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(
      (item) => item.productId === productId
    );

    return item?.quantity ?? 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        return total;
      }

      const price = Number(
        product.price.replace("$", "").replace(",", "")
      );

      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartQuantity,
        getCartTotal,
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