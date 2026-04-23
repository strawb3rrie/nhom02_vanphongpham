"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Category } from "@/lib/data";
import { motion } from "framer-motion";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-16 text-center tracking-tight text-foreground">
          Danh mục sản phẩm
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link 
                href={`${ROUTES.PRODUCTS}?category=${category.id}`}
                className="group flex flex-col items-center p-8 rounded-3xl border border-border/50 bg-card hover:bg-muted/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 text-primary flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-center group-hover:text-primary transition-colors">{category.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
