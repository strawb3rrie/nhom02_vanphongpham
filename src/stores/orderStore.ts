import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cartStore";

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Order;
  cancelOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          date: new Date().toISOString(),
          status: "pending",
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        
        return newOrder;
      },
      cancelOrder: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: "cancelled" } : order
          ),
        })),
    }),
    {
      name: "ute-order-storage",
    }
  )
);
