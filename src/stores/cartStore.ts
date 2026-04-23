import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number; // can be bulk price or regular price
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  addItem: (product: Product, quantity: number, price: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number, price: number) => void;
  applyCoupon: (code: string, amount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  // Compute
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,

      addItem: (product, quantity, price) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            newItems[existingItemIndex].price = price; // update price in case bulk tier reached
            return { items: newItems };
          }
          return { items: [...state.items, { product, quantity, price }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity, price) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity, price } : item
          ),
        })),

      applyCoupon: (code, amount) => set({ couponCode: code, discountAmount: amount }),
      
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      getSubtotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().discountAmount;
        // Need to add shipping conditionally later in checkout, right now total = subtotal - discount
        return Math.max(0, subtotal - discountAmount);
      },
    }),
    {
      name: "ute-cart-storage",
    }
  )
);
