"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getWooClient } from "@/lib/wooClient";
import { GET_CART } from "@/lib/queries";

interface CartCountData {
  cart: {
    contents: { itemCount?: number | null; nodes: { quantity: number }[] };
  };
}

interface CartContextValue {
  count: number;
  refreshCount: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
  count: 0,
  refreshCount: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const client = getWooClient();
      const { data } = await client.query<CartCountData>({
        query: GET_CART,
        fetchPolicy: "network-only",
      });
      const total = (data?.cart?.contents?.nodes || []).reduce(
        (sum, n) => sum + (n.quantity || 0),
        0
      );
      setCount(total);
    } catch {
      // leave count as-is on error
    }
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <CartContext.Provider value={{ count, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
