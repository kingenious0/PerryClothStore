'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ProductRecommendations } from '@/components/shared/ProductRecommendations';
import type { CartItem, Product } from '@/lib/types';
import { ArrowLeft, ShoppingBag, CreditCard, ShieldCheck, Truck, RotateCcw, Plus, Minus, Star, Heart, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-10 w-1/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="pt-8">
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { categories } = useCategories();
  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const productRef = doc(db, 'products', id);
        const docSnap = await getDoc(productRef);
        
        if (!docSnap.exists()) {
          notFound();
        } else {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const images = useMemo(() => product?.images ?? [], [product]);
  const categoryName = categories.find((c) => c.id === product?.category_id)?.name;
  const hasVariants = product?.variants && Object.keys(product.variants).length > 0;
  
  const productInCart = useMemo(() => {
    return cartItems.filter(item => item.productId === product?.id);
  }, [cartItems, product]);

  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: value }));
  };

  const validateSelection = () => {
    if (product.variants && Object.keys(product.variants).length !== Object.keys(selectedVariants).length) {
      toast({
        variant: 'destructive',
        title: 'Selection required',
        description: 'Please select all product options.',
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    const cartItem: CartItem = {
      productId: product.id,
      quantity,
      ...selectedVariants,
    };
    
    addToCart(cartItem);

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
      action: (
        <Button size="sm" onClick={() => router.push('/cart')}>
          View Cart
        </Button>
      ),
    });
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    const cartItem: CartItem = {
      productId: product.id,
      quantity,
      ...selectedVariants,
    };
    
    addToCart(cartItem);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="group text-muted-foreground hover:text-foreground p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-primary/5">
              {images.length > 0 ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-700 ease-in-out"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
              
              {/* Floating Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="bg-orange-500/90 backdrop-blur-md border-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                    Limited: {product.stock} Left
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="bg-red-600/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                    Sold Out
                  </Badge>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300",
                      activeImageIndex === idx 
                        ? "border-primary ring-4 ring-primary/5 shadow-lg scale-110" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:sticky lg:top-32 space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                {categoryName && (
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60 block">
                    {categoryName}
                  </span>
                )}
                <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight text-foreground leading-[1.1]">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-5xl font-light text-foreground tracking-tighter">
                  GH₵{product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-bold text-accent-foreground">4.8</span>
                </div>
              </div>
              
              <Separator className="bg-foreground/5" />
              
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-10 py-4">
                {product.variants && Object.entries(product.variants).map(([variantName, values]) => (
                  <div key={variantName} className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">{variantName}</Label>
                    <div className="flex flex-wrap gap-4">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleVariantChange(variantName, value)}
                          className={cn(
                            "min-w-16 h-12 px-6 rounded-2xl text-sm font-bold border-2 transition-all duration-300",
                            selectedVariants[variantName] === value
                              ? "bg-primary border-primary text-primary-foreground shadow-2xl shadow-primary/30 -translate-y-1"
                              : "bg-background border-foreground/5 text-foreground/60 hover:border-primary/30 hover:text-primary"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-8 pt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                 <div className="flex items-center bg-foreground/5 rounded-3xl p-1.5 border border-foreground/5 shadow-inner">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-2xl h-12 w-12 hover:bg-background shadow-sm disabled:opacity-30"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-14 text-center">
                      <span className="text-lg font-bold">{quantity}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-2xl h-12 w-12 hover:bg-background shadow-sm disabled:opacity-30"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                 </div>

                 <div className="flex-grow grid grid-cols-2 gap-4">
                    <Button 
                      size="xl" 
                      onClick={handleAddToCart} 
                      disabled={product.stock === 0}
                      className="rounded-3xl h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-transform active:scale-95 border-none"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Bag
                    </Button>
                    <Button 
                      size="xl" 
                      variant="outline"
                      onClick={handleBuyNow} 
                      disabled={product.stock === 0}
                      className="rounded-3xl h-16 border-2 border-foreground/10 hover:bg-foreground/5 transition-transform active:scale-95"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Buy Now
                    </Button>
                 </div>
              </div>

              {/* Cart Summary Integration */}
              {productInCart.length > 0 && (
                <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Already in your bag</p>
                      <p className="text-xs text-primary/60">{productInCart.reduce((sum, item) => sum + item.quantity, 0)} items added</p>
                    </div>
                  </div>
                  <Button variant="link" asChild className="text-primary font-black uppercase text-[10px] tracking-widest">
                    <Link href="/cart">Go to Checkout</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-10">
              {[
                { icon: Truck, label: "Complimentary Delivery" },
                { icon: ShieldCheck, label: "Authenticity Guaranteed" },
                { icon: RotateCcw, label: "60-Day Returns" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3 group cursor-default">
                  <div className="bg-foreground/[0.03] p-4 rounded-[1.5rem] group-hover:bg-primary/5 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-tight px-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-40 border-t border-foreground/[0.04] pt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-primary/60">Curated For You</span>
              <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">You Might Also Like</h2>
            </div>
            <Button variant="link" className="text-foreground font-black uppercase tracking-widest text-xs decoration-2 underline-offset-8" asChild>
              <Link href="/shop">Explore Entire Collection</Link>
            </Button>
          </div>
          <ProductRecommendations product={product}/>
        </div>
      </div>
    </div>
  );
}
