import { getCategories, getProducts } from "@/lib/data";
import ProductsPageClient from "./ProductsPageClient";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductsPageClient
      initialProducts={products}
      categories={categories}
    />
  );
}
