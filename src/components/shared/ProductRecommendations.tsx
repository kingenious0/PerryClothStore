'use client';

import { useState, useEffect } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendation-engine';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/skeleton';

interface ProductRecommendationsProps {
  product: Product;
}

export function ProductRecommendations({ product }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    async function fetchRecommendations() {
      if (!products.length || !categories.length || !product) return;
      try {
        setLoading(true);
        const category = categories.find(c => c.id === product.category_id);
        const result = await getProductRecommendations({
          productId: product.id,
          category: category?.name || '',
          productName: product.name,
          productDescription: product.description,
        });

        const recommendedProducts = products.filter(p => 
          result.recommendedProductIds.includes(p.id) && p.id !== product.id
        );
        
        // If AI returns few results, fill with others from the same category
        if (recommendedProducts.length < 4) {
            const categoryProducts = products.filter(p => p.category_id === product.category_id && p.id !== product.id && !result.recommendedProductIds.includes(p.id));
            const needed = 4 - recommendedProducts.length;
            recommendedProducts.push(...categoryProducts.slice(0, needed));
        }

        setRecommendations(recommendedProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch product recommendations:", error);
        // Fallback to category-based recommendations on error
        const categoryProducts = products.filter(p => p.category_id === product.category_id && p.id !== product.id);
        setRecommendations(categoryProducts.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [product, products, categories]);

  if (loading) {
    return (
      <div className="py-20">
        <div className="text-center mb-16 space-y-4">
             <span className="text-xs font-bold text-primary uppercase tracking-[0.4em]">Curated For You</span>
             <h2 className="text-4xl md:text-6xl font-headline font-bold">You Might <span className="gold-gradient-text italic">Desire</span></h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
                 <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] w-full rounded-[40px]" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                    <Skeleton className="h-4 w-1/4 mx-auto" />
                </div>
            ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-20">
      <div className="text-center mb-16 space-y-4">
           <span className="text-xs font-bold text-primary uppercase tracking-[0.4em]">Curated For You</span>
           <h2 className="text-4xl md:text-6xl font-headline font-bold">You Might <span className="gold-gradient-text italic">Desire</span></h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((recommendedProduct, index) => (
          <div key={recommendedProduct.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard product={recommendedProduct} />
          </div>
        ))}
      </div>
    </div>
  );
}
