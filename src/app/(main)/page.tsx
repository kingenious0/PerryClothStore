'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { ArrowRight, Sparkles, Shield, Truck, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
          <Skeleton className="mt-4 h-4 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1627292441194-0280c19e74e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzY5NTM4MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "fashion model"
  };

  return (
    <div className="mobile-app-container">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="PerryStore luxury fashion"
              fill
              priority
              className="object-cover scale-105"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </div>
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Animated floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative h-full flex flex-col items-center justify-end text-center p-6 pb-16">
          {/* Premium badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Luxury Collection 2024</span>
          </div>
          
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 text-white fade-in"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            Elegance
            <span className="block text-gradient">Redefined</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/90 fade-in" style={{ animationDelay: '0.2s', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Discover timeless pieces crafted with passion and precision
          </p>
          
          <Button 
            asChild 
            size="lg" 
            className="btn-premium bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base font-semibold shadow-2xl shadow-primary/20 fade-in touch-feedback"
            style={{ animationDelay: '0.4s' }}
          >
            <Link href="/shop" className="flex items-center gap-2">
              Explore Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Premium Features Strip */}
      <section className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Secure Payment</h3>
              <p className="text-xs text-white/60">256-bit SSL encrypted</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Fast Delivery</h3>
              <p className="text-xs text-white/60">Nationwide shipping</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Premium Quality</h3>
              <p className="text-xs text-white/60">Authentic products</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Curated Selection</h3>
              <p className="text-xs text-white/60">Hand-picked items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Curated Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-gradient">Collection</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces that define luxury and sophistication
            </p>
          </div>
          
          {loading ? (
            <FeaturedProductsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 touch-feedback"
            >
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="fade-in">
              <div className="text-5xl font-bold text-primary mb-2">5K+</div>
              <p className="text-white/60">Happy Customers</p>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-white/60">Satisfaction Rate</p>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <p className="text-white/60">Support</p>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-bold text-primary mb-2">100%</div>
              <p className="text-white/60">Authentic</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
