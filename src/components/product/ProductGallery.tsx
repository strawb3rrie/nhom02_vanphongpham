"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl border border-border/40 bg-secondary/30 dark:bg-secondary/20 overflow-hidden shadow-sm">
        <Image
          src={images[activeIndex]}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-xl border bg-secondary/30 dark:bg-secondary/20 overflow-hidden shrink-0 transition-all",
                activeIndex === index
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : "border-border/40 hover:border-primary/50"
              )}
            >
              <Image
                src={src}
                alt={`${name} - ảnh ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
