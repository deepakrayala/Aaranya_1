import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CatalogProduct } from "@/lib/api/catalog";

const cartKey = "aranya:cart";

export type CartItem = {
  product_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price_paise: number;
  stock_quantity: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalPaise: number;
  addProduct: (product: CatalogProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.product_id === "string" &&
    typeof item.name === "string" &&
    typeof item.slug === "string" &&
    (typeof item.image_url === "string" || item.image_url === null) &&
    typeof item.price_paise === "number" &&
    typeof item.stock_quantity === "number" &&
    typeof item.quantity === "number"
  );
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(stock, quantity));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !ready) return;
    window.localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, ready]);

  const addProduct = useCallback((product: CatalogProduct, quantity = 1) => {
    if (product.status !== 1 || product.stock_quantity < 1) return;
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                price_paise: product.price_paise,
                stock_quantity: product.stock_quantity,
                quantity: clampQuantity(item.quantity + quantity, product.stock_quantity),
              }
            : item,
        );
      }
      return [
        ...current,
        {
          product_id: product.id,
          name: product.name,
          slug: product.slug,
          image_url: product.image_url,
          price_paise: product.price_paise,
          stock_quantity: product.stock_quantity,
          quantity: clampQuantity(quantity, product.stock_quantity),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: clampQuantity(quantity, Math.max(1, item.stock_quantity)) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalPaise = items.reduce((sum, item) => sum + item.price_paise * item.quantity, 0);
    return { items, count, subtotalPaise, addProduct, updateQuantity, removeItem, clearCart };
  }, [addProduct, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
