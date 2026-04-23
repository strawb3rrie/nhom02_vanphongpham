"use client";

import { Product } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export function RelatedProducts({ 
  currentProductId, 
  currentCategory, 
  allProducts 
}: { 
  currentProductId: number;
  currentCategory: string;
  allProducts: Product[];
}) {
  const related = allProducts
    .filter(p => p.id !== currentProductId && p.category === currentCategory)
    .slice(0, 4);
    
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <h3 className="font-bold font-heading text-2xl mb-8">Sản phẩm liên quan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
