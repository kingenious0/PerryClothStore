'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCategories } from "@/hooks/use-categories";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <Link href={`/product/${product.id}`} className="group block">
      <Card 
        className="overflow-hidden h-full flex flex-col transition-all duration-700 bg-background/50 backdrop-blur-sm border border-primary/10 rounded-3xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:-translate-y-3 group-hover:border-primary/40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] overflow-hidden relative">
          {imageSrc && imageSrc.startsWith('http') ? (
            <>
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="font-bold uppercase tracking-tighter rounded-full px-4 h-6">Sold Out</Badge>
                ) : isLowStock ? (
                  <Badge className="bg-orange-500/90 backdrop-blur-md text-white font-bold uppercase tracking-tighter border-none rounded-full px-4 h-6 animate-pulse">
                    Limited Edition
                  </Badge>
                ) : null}
              </div>
              
              {/* Quick action buttons - Premium Style */}
              <div className={cn(
                "absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 transition-all duration-500 z-20",
                isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-12 w-12 bg-white/90 backdrop-blur-md hover:bg-primary hover:text-white border border-primary/20 transition-all duration-300 shadow-xl"
                  onClick={(e) => e.preventDefault()}
                >
                  <Eye className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-12 w-12 bg-white/90 backdrop-blur-md hover:bg-primary hover:text-white border border-primary/20 transition-all duration-300 shadow-xl"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-30">No Visualization</span>
            </div>
          )}
        </div>
        <CardContent className="p-8 flex-grow flex flex-col justify-between relative bg-background/80 backdrop-blur-xl">
          <div className="space-y-3">
            <span className="text-[10px] text-primary uppercase font-bold tracking-[0.3em] opacity-80">{categoryName}</span>
            <h3 className="text-xl font-headline font-bold leading-tight group-hover:gold-gradient-text transition-all duration-300 line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic opacity-70">
                {product.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-primary/5">
            <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Investment</span>
                <p className="text-xl font-headline font-bold gold-gradient-text">GH₵{product.price.toFixed(2)}</p>
            </div>
            {!isOutOfStock && (
                <Button 
                    size="icon" 
                    className="rounded-full h-10 w-10 gold-gradient shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
