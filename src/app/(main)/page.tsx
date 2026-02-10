'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { ArrowRight, Sparkles, Shield, Truck, Award, Package } from 'lucide-react';
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
  const featuredProducts = products.slice(0, 8);
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1627292441194-0280c19e74e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzY5NTM4MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "fashion model"
  };

  return (
    <div className="mobile-app-container overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.imageUrl}
            alt="PerryStore luxury fashion"
            fill
            priority
            className="object-cover scale-105 animate-[scale-slow_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 md:hidden" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full premium-glass border-primary/30 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">The 2024 Collection</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-headline font-bold text-white leading-[0.9] animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                True <br />
                <span className="gold-gradient-text italic">Opulence</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/80 max-w-xl font-light leading-relaxed animate-in fade-in slide-in-from-left-16 duration-1000 delay-500">
              Curated garments that blend traditional craftsmanship with contemporary luxury. Experience fashion as art.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
              <Button 
                asChild 
                size="lg" 
                className="gold-gradient hover:scale-105 transition-all duration-500 rounded-full px-12 h-16 text-sm font-bold uppercase tracking-widest shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
              >
                <Link href="/shop" className="flex items-center gap-3">
                  Shop Concept
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="rounded-full px-12 h-16 text-sm font-bold uppercase tracking-widest border-white/30 text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
              >
                <Link href="/about">Our Ethos</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent" />
              <div className="relative h-20 w-20 flex items-center justify-center rounded-full border border-primary/30 group cursor-pointer hover:border-primary transition-colors">
                  <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-20" />
                  <Package className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="h-32 w-[1px] bg-gradient-to-t from-transparent via-primary to-transparent" />
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] opacity-20" />
      </section>

      {/* Luxury Features Strip */}
      <section className="relative z-20 -mt-10 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="premium-glass p-8 rounded-[40px] flex flex-col items-center text-center gap-4 hover-glow cursor-default transition-all duration-500">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase">Safe & Secure</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Vault-grade encryption for every transaction.</p>
            </div>
            <div className="premium-glass p-8 rounded-[40px] flex flex-col items-center text-center gap-4 hover-glow cursor-default transition-all duration-500" style={{ transitionDelay: '0.1s' }}>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase">Global Concierge</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Priority door-to-door delivery worldwide.</p>
            </div>
            <div className="premium-glass p-8 rounded-[40px] flex flex-col items-center text-center gap-4 hover-glow cursor-default transition-all duration-500" style={{ transitionDelay: '0.2s' }}>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase">Mastery Craft</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Each piece is a testament to sartorial excellence.</p>
            </div>
            <div className="premium-glass p-8 rounded-[40px] flex flex-col items-center text-center gap-4 hover-glow cursor-default transition-all duration-500" style={{ transitionDelay: '0.3s' }}>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase">Bespoke Curation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Personalized selections tailored to your taste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl space-y-4">
                <span className="text-xs font-bold text-primary uppercase tracking-[0.4em]">Selected Pieces</span>
                <h2 className="text-5xl md:text-7xl font-headline font-bold leading-[0.9]">
                    Seasonal <br />
                    <span className="gold-gradient-text italic">Highlights</span>
                </h2>
                <p className="text-muted-foreground max-w-md pt-4">
                  A glimpse into our most celebrated designs, meticulously chosen for the discerning eye.
                </p>
            </div>
            <Button 
              asChild 
              variant="link" 
              className="text-foreground font-bold uppercase tracking-widest text-xs h-auto p-0 pb-1 border-b-2 border-primary group"
            >
              <Link href="/shop" className="flex items-center gap-3">
                View Entire Collection
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <FeaturedProductsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section with Glass Effect */}
      <section className="py-40 relative bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550412635-42796e6f5c86?q=80&w=2070')] bg-fixed bg-cover transition-transform scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl font-headline font-bold gold-gradient-text tracking-tighter">5k+</div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Patrons Served</p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl font-headline font-bold gold-gradient-text tracking-tighter">98%</div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Trust Index</p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl font-headline font-bold gold-gradient-text tracking-tighter">24hr</div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Service Concierge</p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl font-headline font-bold gold-gradient-text tracking-tighter">100%</div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Provenance Guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
