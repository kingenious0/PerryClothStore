'use client';

import { useCart } from '@/hooks/use-cart';
import { useProducts } from '@/hooks/use-products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { products } = useProducts();
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const cartDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartDetails.reduce((acc, item) => {
    const qty = isNaN(item.quantity) ? 0 : item.quantity;
    return acc + (item.product?.price ?? 0) * qty;
  }, 0);

  if (cartCount === 0) {
    return (
        <div className="container mx-auto px-4 md:px-8 py-40 text-center relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="relative inline-block mb-12">
                <ShoppingBag className="h-32 w-32 text-primary/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <X className="h-10 w-10 text-primary opacity-30" />
                </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">Your Wardrobe is <span className="gold-gradient-text italic">Awaiting</span></h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto font-light">
              It seems you haven't selected any artifacts for your collection yet.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 h-16 gold-gradient hover:scale-105 transition-all text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20 border-none">
                <Link href="/shop">Explore Collections</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()} className="group text-muted-foreground hover:text-primary p-0 h-auto hover:bg-transparent flex items-center gap-3 transition-all mb-4">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-2" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Continue Selection</span>
                </Button>
                <h1 className="text-5xl md:text-7xl font-headline font-bold">Your <span className="gold-gradient-text italic">Collection</span></h1>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase text-muted-foreground">
                <span className="text-primary font-bold">{cartCount}</span> {cartCount === 1 ? 'Artifact' : 'Artifacts'}
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-10">
            {cartDetails.map(item => {
              if (!item.product) return null;
              const image = item.product.images?.[0];
              return (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="group relative flex flex-col sm:flex-row gap-8 items-center p-8 rounded-[40px] premium-glass border-primary/5 hover:border-primary/20 transition-all duration-500">
                  <div className="relative h-44 w-36 rounded-3xl overflow-hidden flex-shrink-0 bg-background shadow-xl">
                    {image && image.startsWith('http') ? (
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        sizes="144px"
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold opacity-30">No Visualization</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow space-y-4 w-full text-center sm:text-left">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">{item.product.category_id}</span>
                        <Link href={`/product/${item.productId}`} className="text-2xl font-headline font-bold hover:gold-gradient-text transition-all block">
                          {item.product.name}
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      {item.size && (
                        <Badge variant="outline" className="rounded-full border-primary/10 text-[10px] px-4 py-1 tracking-widest uppercase font-bold">
                            Size: {item.size}
                        </Badge>
                      )}
                      {item.color && (
                        <Badge variant="outline" className="rounded-full border-primary/10 text-[10px] px-4 py-1 tracking-widest uppercase font-bold">
                            Tone: {item.color}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-8 pt-4">
                      <div className="flex items-center bg-background/50 rounded-full p-1 border border-primary/10 shadow-inner">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-10 w-10 hover:bg-background"
                          onClick={() => updateQuantity(item.productId, Math.max(1, (isNaN(item.quantity) ? 1 : item.quantity) - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center font-headline font-bold">{isNaN(item.quantity) ? 1 : item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-10 w-10 hover:bg-background"
                          onClick={() => updateQuantity(item.productId, (isNaN(item.quantity) ? 1 : item.quantity) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-2xl font-headline font-bold gold-gradient-text">
                        GH₵{((item.product?.price ?? 0) * (isNaN(item.quantity) ? 0 : item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromCart(item.productId)}
                    className="absolute top-6 right-6 h-10 w-10 rounded-full border border-primary/10 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="premium-glass rounded-[40px] p-10 space-y-8 sticky top-32 border-primary/10 shadow-2xl">
              <h2 className="text-3xl font-headline font-bold italic border-b border-primary/10 pb-6 uppercase tracking-widest">Summary</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest">Appraisal</span>
                  <span className="font-headline font-bold text-xl">GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest">Concierge Delivery</span>
                  <span className="text-primary font-bold uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="h-px bg-gradient-to-r from-primary/20 to-transparent w-full" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-headline font-bold uppercase tracking-[0.2em]">Investment</span>
                  <span className="text-3xl font-headline font-bold gold-gradient-text">GH₵{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button asChild size="xl" className="w-full rounded-full h-20 gold-gradient hover:scale-105 transition-all text-white font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 border-none">
                    <Link href="/checkout" className="flex items-center gap-3">
                        Secure Collection
                        <CreditCard className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                    <ShieldCheck className="h-4 w-4" />
                    Invariable Security Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
