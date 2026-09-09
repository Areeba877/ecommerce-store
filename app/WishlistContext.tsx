"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from database when user opens the app
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const products = data.wishlist?.products || [];

        const productIds = products.map((product: any) =>
          typeof product === "string" ? product : product._id
        );

        setWishlist(productIds);
      } catch (error) {
        console.error("Wishlist load error:", error);
      }
    };

    loadWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    try {
      const isCurrentlyWishlisted = wishlist.includes(productId);

      if (isCurrentlyWishlisted) {
        // Remove from database
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove from wishlist");
        }

        setWishlist((current) =>
          current.filter((id) => id !== productId)
        );
      } else {
        // Add to database
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to wishlist");
        }

        setWishlist((current) => [...current, productId]);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}