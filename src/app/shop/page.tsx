'use client';

import { Suspense, useState, useMemo } from 'react';
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

function ShopPageContent() {
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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 py-12 relative">
         {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-12 hover:bg-primary/10 hover:text-primary transition-all rounded-full group px-6"
        >
          <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Return to Essence
        </Button>

        {/* Header */}
        <div className="max-w-4xl mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4 block">The Gallery</span>
          <h1 className="text-5xl md:text-8xl font-headline font-bold leading-tight mb-6">
            Our <span className="gold-gradient-text italic">Curation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Meticulously selected pieces that embody our philosophy of timeless elegance and unparalleled craft.
          </p>
        </div>

        {/* Search and Filters Bar - Premium Glassmorphism */}
        <div className="premium-glass rounded-[40px] p-8 mb-12 flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <Input
                type="text"
                placeholder="Seek and you shall find..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-12 h-14 rounded-full bg-background/50 border-primary/20 focus-visible:ring-primary shadow-sm text-sm tracking-wide"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-[220px] h-14 rounded-full bg-background/50 border-primary/20 focus:ring-primary">
                    <SelectValue placeholder="Ordering" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20">
                    <SelectItem value="newest">Latest Collections</SelectItem>
                    <SelectItem value="price-low">Value: Low to High</SelectItem>
                    <SelectItem value="price-high">Value: High to Low</SelectItem>
                    <SelectItem value="name-asc">Alphabetical: A to Z</SelectItem>
                    <SelectItem value="name-desc">Alphabetical: Z to A</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex gap-2 p-1.5 bg-background/50 backdrop-blur-md rounded-full border border-primary/10">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                        "h-11 w-11 rounded-full transition-all duration-300",
                        viewMode === 'grid' ? "gold-gradient shadow-lg" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'large' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('large')}
                    className={cn(
                        "h-11 w-11 rounded-full transition-all duration-300",
                        viewMode === 'large' ? "gold-gradient shadow-lg" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex-1 h-14 rounded-full border-primary/20 hover:bg-primary/5"
                >
                  <Filter className="mr-3 h-5 w-5 text-primary" />
                  Filters
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Filters */}
            <aside className={cn(
                "lg:col-span-1 space-y-12",
                showFilters ? "block" : "hidden lg:block"
            )}>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-primary/10">
                  <h3 className="font-headline font-bold text-xl tracking-tight flex items-center gap-3 italic">
                    Categories
                  </h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-primary/5"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/shop"
                    className={cn(
                        "group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300",
                        !selectedCategory 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                    )}
                  >
                    <span className="font-medium tracking-wide">All Perspectives</span>
                    <Badge variant={!selectedCategory ? 'secondary' : 'outline'} className="rounded-full font-bold">
                        {products.length}
                    </Badge>
                  </Link>
                  
                  {categoriesLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-2xl" />
                    ))
                  ) : (
                    categories.map((category) => {
                      const count = products.filter(p => p.category_id === category.id).length;
                      const isActive = selectedCategory?.toLowerCase() === category.name.toLowerCase();
                      
                      return (
                        <Link
                          key={category.id}
                          href={`/shop?category=${category.name.toLowerCase()}`}
                          className={cn(
                            "group flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300",
                            isActive 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                          )}
                        >
                          <span className="font-medium tracking-wide">{category.name}</span>
                          {count > 0 && (
                            <Badge variant={isActive ? 'secondary' : 'outline'} className="rounded-full font-bold">
                              {count}
                            </Badge>
                          )}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Decorative Brand Section */}
              <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
                  <Crown className="h-8 w-8 text-primary mb-4 opacity-50" />
                  <h4 className="font-headline font-bold text-lg mb-2">Private Viewing</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "Fashion is not just clothes, it's the armor for the soul."
                  </p>
              </div>
            </aside>

            {/* Main Shop Content */}
            <div className="lg:col-span-3">
                {/* Results Count & Current Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 pb-4 border-b border-primary/5">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                    {productsLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <>
                        <span className="text-foreground font-bold">{filteredAndSortedProducts.length}</span> Masterpieces Revealed
                      </>
                    )}
                  </p>
                  
                  {selectedCategory && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-bold tracking-widest text-[10px] uppercase">
                        Archive: {selectedCategory}
                    </Badge>
                  )}
                </div>

                {/* Products Grid */}
                {productsLoading ? (
                  <ShopSkeleton view={viewMode} />
                ) : filteredAndSortedProducts.length > 0 ? (
                  <div className={`grid gap-x-8 gap-y-12 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {filteredAndSortedProducts.map((product, index) => (
                      <div key={product.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 0.05}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 premium-glass rounded-[60px] border-dashed border-primary/20">
                    <div className="relative">
                        <Search className="h-20 w-20 text-primary opacity-20" />
                        <div className="absolute inset-0 animate-ping rounded-full border border-primary/10 scale-150" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-headline font-bold italic">The search continues</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto font-light leading-relaxed">
                          {searchQuery 
                            ? `We couldn't find any artifacts matching "${searchQuery}". Perhaps try a different search?`
                            : 'This collection is currently being curated. Please check back later.'}
                        </p>
                    </div>
                    <Button onClick={clearFilters} variant="outline" className="rounded-full px-10 h-14 font-bold uppercase tracking-widest border-primary/30 hover:bg-primary hover:text-white transition-all">
                      View All Collections
                    </Button>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-12 w-48 mb-8" />
          <ShopSkeleton view="grid" />
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
