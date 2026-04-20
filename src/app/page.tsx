import { HeroBanner } from "@/components/home/HeroBanner";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromotionBanner } from "@/components/home/PromotionBanner";
import { getCategories, getProducts, getPromotions } from "@/lib/data";

export default async function Home() {
  const [categories, products, promotions] = await Promise.all([
    getCategories(),
    getProducts(),
    getPromotions(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      <CategorySection categories={categories} />
      <FeaturedProducts products={products} />
      <PromotionBanner promotions={promotions} />
    </div>
  );
}
