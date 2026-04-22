"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden bg-background flex items-center justify-center pt-20 pb-32">
      {/* Background with blend mode and gradients for premium feel */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-20 grayscale bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2000&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-64 z-0 bg-linear-to-b from-background to-transparent" />
      
      {/* Soft glowing blob behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-8 tracking-tighter leading-[1.1] text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Chất lượng <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary to-accent animate-pulse">nét viết</span><br/>
            hiệu quả công việc
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Nền tảng mua sắm văn phòng phẩm cao cấp trực tuyến. Đa dạng mẫu mã, thương hiệu uy tín, công cụ nâng tầm sáng tạo.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:bg-primary/95 transition-all duration-300 w-full sm:w-auto"
            >
              Khám phá ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href={ROUTES.ABOUT}
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-medium text-lg hover:bg-secondary/80 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto border border-border/50"
            >
              Tìm hiểu thêm
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
