import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getAssetPath(path: string) {
  return `${basePath}${path}`;
}
