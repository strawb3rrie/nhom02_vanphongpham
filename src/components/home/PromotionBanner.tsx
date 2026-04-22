"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Promotion } from "@/lib/data";

export function PromotionBanner({ promotions }: { promotions: Promotion[] }) {
  if (!promotions || promotions.length === 0) return null;
  
  const promo = promotions[0]; // just use the first one for the banner

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-accent text-accent-foreground rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-bold tracking-wider mb-4 uppercase">
              Ưu đãi đặc biệt
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {promo.title}
            </h2>
            <p className="text-lg opacity-90 mb-6">
              {promo.description} Nhập mã <strong className="bg-white/20 px-2 py-1 rounded mx-1">{promo.code}</strong> khi thanh toán.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link 
              href={ROUTES.PRODUCTS}
              className="inline-flex bg-background text-foreground px-8 py-4 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
            >
              Mua sắm ngay
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
