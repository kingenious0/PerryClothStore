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
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
                 <div key={i}>
                    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                    <Skeleton className="mt-4 h-4 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-1/4" />
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
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((recommendedProduct) => (
          <ProductCard key={recommendedProduct.id} product={recommendedProduct} />
        ))}
      </div>
    </div>
  );
}
