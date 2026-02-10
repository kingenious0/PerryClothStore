'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCategories } from "@/hooks/use-categories";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { categories } = useCategories();
  const [isHovered, setIsHovered] = useState(false);
  const categoryName = categories.find(c => c.id === product.category_id)?.name || 'Uncategorized';
  const imageSrc = product.images?.[0];
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;
  
  return (
    <Link href={`/product/${product.id}`} className="group">
      <Card 
        className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 hover:border-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] overflow-hidden relative bg-muted">
          {imageSrc && imageSrc.startsWith('http') ? (
            <>
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {isOutOfStock && (
                  <Badge variant="destructive" className="font-bold">Out of Stock</Badge>
                )}
                {!isOutOfStock && isLowStock && (
                  <Badge variant="secondary" className="bg-orange-500 text-white font-bold">Only {product.stock} left</Badge>
                )}
              </div>
              
              {/* Quick action buttons */}
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} flex items-center justify-center gap-2`}>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-10 w-10 bg-white hover:bg-white/90"
                  onClick={(e) => {
                    e.preventDefault();
                    // Quick view functionality can be added here
                  }}
                >
                  <Eye className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-10 w-10 bg-white hover:bg-white/90"
                  onClick={(e) => {
                    e.preventDefault();
                    // Wishlist functionality can be added here
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{categoryName}</p>
            <h3 className="text-lg font-headline mt-1 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xl font-bold text-primary">GH₵{product.price.toFixed(2)}</p>
            {!isOutOfStock && (
              <div className={`transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                <Button size="sm" variant="ghost" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
