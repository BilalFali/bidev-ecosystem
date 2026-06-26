"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/products";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductGalleryProps {
  cover: string | null;
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ cover, images, title }: ProductGalleryProps) {
  const all: GalleryImage[] = [
    ...(cover ? [{ id: "cover", url: cover, alt: title }] : []),
    ...images,
  ];

  const [selected, setSelected] = useState(0);

  if (all.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={all[selected].url}
          alt={all[selected].alt ?? title}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {all.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border transition-all ${
                i === selected
                  ? "border-accent ring-1 ring-accent/30"
                  : "border-border hover:border-border-strong"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
