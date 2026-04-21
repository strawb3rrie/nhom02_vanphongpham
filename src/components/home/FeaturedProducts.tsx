"use client";

import { Product } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter(p => p.featured).slice(0, 8);
  
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 tracking-tight text-foreground">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground text-lg">Những dụng cụ được lựa chọn nhiều nhất</p>
          </div>
          <Link href={ROUTES.PRODUCTS} className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300">
            Xem tất cả <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
