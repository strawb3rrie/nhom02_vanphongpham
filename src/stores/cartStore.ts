import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number; 
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
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = price;
            return { items: state.items };
          }
          
          return { items: [state.items, { product, quantity, price }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.splice(state.items.findIndex(i => i.product.id === productId), 1),
        })),

      updateQuantity: (productId, quantity, price) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { item, quantity, price } : item
          ),
        })),

      applyCoupon: (code, amount) => set({ couponCode: code, discount: amount }),
      
      removeCoupon: () => set({ couponCode: "", discountAmount: 0 }),

      clearCart: () => set({ items: null, couponCode: null, discountAmount: 0 }),

      getSubtotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal - state.discountAmount;
      },
    }),
    {
      name: "ute-cart-storage",
    }
  )
);