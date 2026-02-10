'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
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
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="PerryStore fashion"
            fill
            priority
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
          >
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
            Discover our new collection, crafted with passion and precision for the modern connoisseur.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Products</h2>
          {loading ? (
            <FeaturedProductsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-slate-50 border-y">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-muted-foreground text-sm">256-bit SSL encryption protects your transactions via Paystack</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm">Reliable shipping across Ghana with real-time tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Multiple Payment Options</h3>
              <p className="text-muted-foreground text-sm">Pay with Card, Mobile Money, or Bank Transfer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Customers Love Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Join thousands of satisfied customers who trust PerryStore for quality and elegance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Authentic Products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
