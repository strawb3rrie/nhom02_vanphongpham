import { getCategories, getProducts } from "@/lib/data";
import ProductsPageClient from "./ProductsPageClient";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductsPageClient
      initialProducts={products}
      categories={categories}
      categoryParam={category}
      queryParam={q}
    />
  );
}
