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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 py-12 relative">
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />

        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-16">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="group text-muted-foreground hover:text-primary p-0 h-auto hover:bg-transparent flex items-center gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Back to Gallery</span>
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-primary/10 hover:bg-primary/5 hover:text-primary transition-all">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-primary/10 hover:bg-primary/5 hover:text-primary transition-all">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-12">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] premium-glass border-primary/10 shadow-2xl group">
              {images.length > 0 ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-30">No Visualization</span>
                </div>
              )}
              
              {/* Luxury Badges */}
              <div className="absolute top-10 left-10 flex flex-col gap-3">
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="bg-orange-500/80 backdrop-blur-xl border-none px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Rarity: {product.stock} Remaining
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="bg-red-600/80 backdrop-blur-xl border-none px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Archived
                  </Badge>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-6 px-4 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-[20px] border-2 transition-all duration-500",
                      activeImageIndex === idx 
                        ? "border-primary shadow-[0_10px_30px_rgba(212,175,55,0.3)] scale-110" 
                        : "border-primary/5 opacity-40 hover:opacity-100 hover:border-primary/30"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                {categoryName && (
                  <span className="text-xs font-bold uppercase tracking-[0.5em] text-primary/80 block italic">
                    {categoryName}
                  </span>
                )}
                <h1 className="text-5xl md:text-8xl font-headline font-bold text-foreground leading-[0.9] tracking-tighter">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-8">
                <p className="text-6xl font-headline font-bold gold-gradient-text tracking-tighter">
                  GH₵{product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-bold text-primary">4.9 / 5.0</span>
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-primary/20 via-primary/5 to-transparent w-full" />
              
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl italic">
                "{product.description}"
              </p>
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-12 py-4">
                {product.variants && Object.entries(product.variants).map(([variantName, values]) => (
                  <div key={variantName} className="space-y-6">
                    <Label className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground">{variantName}</Label>
                    <div className="flex flex-wrap gap-4">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleVariantChange(variantName, value)}
                          className={cn(
                            "min-w-20 h-14 px-8 rounded-2xl text-xs font-bold uppercase tracking-widest border-2 transition-all duration-500",
                            selectedVariants[variantName] === value
                              ? "gold-gradient border-primary text-white shadow-[0_10px_30px_rgba(212,175,55,0.4)] -translate-y-2"
                              : "bg-background border-primary/10 text-muted-foreground hover:border-primary/40 hover:text-primary"
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
            <div className="space-y-10 pt-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
                 <div className="flex items-center bg-primary/5 rounded-full p-2 border border-primary/10 shadow-inner w-fit">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-12 w-12 hover:bg-background shadow-sm disabled:opacity-30"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 text-center">
                      <span className="text-xl font-headline font-bold">{quantity}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-12 w-12 hover:bg-background shadow-sm disabled:opacity-30"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                 </div>

                 <div className="flex-grow grid grid-cols-2 gap-6">
                    <Button 
                      size="xl" 
                      onClick={handleAddToCart} 
                      disabled={product.stock === 0}
                      className="rounded-full h-16 gold-gradient hover:scale-105 transition-all text-white font-bold uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(212,175,55,0.3)] border-none"
                    >
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      Acquire
                    </Button>
                    <Button 
                      size="xl" 
                      variant="outline"
                      onClick={handleBuyNow} 
                      disabled={product.stock === 0}
                      className="rounded-full h-16 border-2 border-primary/20 hover:bg-primary/5 hover:border-primary transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      Establish Possession
                    </Button>
                 </div>
              </div>

              {/* Cart Summary */}
              {productInCart.length > 0 && (
                <div className="premium-glass rounded-[32px] p-8 border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">In Your Possession</p>
                        <p className="text-xs text-primary/60 font-medium">Currently {productInCart.reduce((sum, item) => sum + item.quantity, 0)} units reserved.</p>
                    </div>
                  </div>
                  <Button variant="link" asChild className="text-primary font-bold uppercase text-[10px] tracking-[0.3em] hover:tracking-[0.4em] transition-all">
                    <Link href="/cart">Examine Bag</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-primary/10">
              {[
                { icon: Truck, label: "Concierge Delivery" },
                { icon: ShieldCheck, label: "Certified Original" },
                { icon: RotateCcw, label: "Elegant Returns" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 group cursor-default">
                  <div className="bg-primary/5 p-5 rounded-[22px] group-hover:bg-primary/10 transition-colors duration-500">
                    <item.icon className="h-6 w-6 text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80 leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-60">
          <ProductRecommendations product={product}/>
        </div>
      </div>
    </div>
  );
}
