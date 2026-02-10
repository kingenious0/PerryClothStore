'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Grid3x3, 
  LayoutGrid,
  X,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

function ShopSkeleton({ view }: { view: 'grid' | 'large' }) {
  const cols = view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${cols} gap-6`}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const selectedCategory = searchParams.get('category');

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        const category = categories.find(c => c.id === product.category_id);
        return category?.name.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    return sorted;
  }, [products, categories, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    router.push('/shop');
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our curated selection of premium products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-12 w-12 rounded-xl"
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'large' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('large')}
                className="h-12 w-12 rounded-xl"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden h-12 rounded-xl"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`mb-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Categories
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                asChild 
                variant={!selectedCategory ? 'default' : 'outline'}
                className="rounded-full"
              >
                <Link href="/shop">
                  All Products
                  {!selectedCategory && (
                    <Badge variant="secondary" className="ml-2">
                      {products.length}
                    </Badge>
                  )}
                </Link>
              </Button>
              
              {categoriesLoading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))
              ) : (
                categories.map((category) => {
                  const count = products.filter(p => p.category_id === category.id).length;
                  const isActive = selectedCategory?.toLowerCase() === category.name.toLowerCase();
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? 'default' : 'outline'}
                      asChild
                      className="rounded-full"
                    >
                      <Link href={`/shop?category=${category.name.toLowerCase()}`}>
                        {category.name}
                        {count > 0 && (
                          <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-2">
                            {count}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {productsLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <>
                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredAndSortedProducts.length}</span> {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory && (
                  <span className="ml-1">
                    in <span className="font-bold text-purple-600">{selectedCategory}</span>
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <ShopSkeleton view={viewMode} />
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : 'There are no products in this category'}
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
