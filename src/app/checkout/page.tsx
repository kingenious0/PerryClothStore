'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useProducts } from '@/hooks/use-products';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { db, auth } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { generateOrderNumber } from '@/types/order';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\s-()]+$/, 'Please enter a valid phone number'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),
  city: z.string()
    .min(2, 'City name is required')
    .max(50, 'City name is too long'),
  region: z.string()
    .min(2, 'Region is required')
    .max(50, 'Region is too long'),
  digitalAddress: z.string().max(20, 'Digital address is too long').optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { products } = useProducts();
  const { cartItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();


  useEffect(() => {
    try {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error in checkout:', error);
      // Auth not configured, continue as guest
    }
  }, []);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      city: '',
      region: '',
      digitalAddress: '',
    },
  });

  // Update email when user logs in
  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
    }
  }, [user, form]);

  const cartDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartDetails.reduce((acc, item) => {
    const qty = isNaN(item.quantity) ? 0 : item.quantity;
    return acc + (item.product?.price ?? 0) * qty;
  }, 0);

  const shippingCost = 0; // Free shipping
  const total = subtotal + shippingCost;

  async function onSubmit(data: CheckoutFormValues) {
    if (cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cart is empty',
        description: 'Please add items to your cart before checking out.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      
      // Create order in Firestore
      const orderData = {
        orderNumber,
        userId: user?.uid || 'guest',
        customerEmail: data.email,
        customerName: `${data.firstName} ${data.lastName}`,
        customerPhone: data.phoneNumber,
        
        items: cartItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            name: product?.name || 'Unknown Product',
            price: product?.price || 0,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
            imageUrl: product?.images?.[0] || null,
          };
        }),
        
        subtotal,
        shippingCost,
        discount: 0,
        total,
        currency: 'GHS',
        
        status: 'placed',
        paymentStatus: 'pending',
        
        shippingAddress: {
          fullName: `${data.firstName} ${data.lastName}`,
          phoneNumber: data.phoneNumber,
          addressLine1: data.address,
          city: data.city,
          region: data.region,
          digitalAddress: data.digitalAddress || null,
        },
        
        shippingMethod: 'Standard Delivery',
        
        timeline: [
          {
            status: 'placed',
            timestamp: new Date(),
            note: 'Order placed successfully',
          },
        ],
        
        paymentMethod: 'paystack',
        
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Initialize Paystack payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderRef.id,
          userId: user?.uid || 'guest',
          email: data.email,
          amount: total,
          customerName: `${data.firstName} ${data.lastName}`,
          items: orderData.items,
        }),
      });

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(paymentData.error || 'Failed to initialize payment');
      }

      // Clear cart before redirecting to payment
      clearCart();
      
      // Redirect to Paystack payment page
      window.location.href = paymentData.data.authorization_url;
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        variant: 'destructive',
        title: 'Checkout failed',
        description: error.message || 'There was an error processing your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center relative mb-12">
             <Button variant="ghost" onClick={() => router.back()} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0 h-auto hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Checkout</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Shipping Information
                </h2>
                <Form {...form}>
                    <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="you@example.com" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                            <Input placeholder="0XX XXX XXXX" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input {...field} className="rounded-xl h-12" /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl><Input placeholder="Greater Accra" {...field} className="rounded-xl h-12" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="digitalAddress"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ghana Digital Address (Optional)</FormLabel>
                            <FormControl>
                            <Input placeholder="GD-XXX-XXXX" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </form>
                </Form>
              </section>
            </div>

            <div className="sticky top-32 space-y-8">
              <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50">
                  <h2 className="text-2xl font-bold mb-8 font-headline">Order Summary</h2>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                    {cartDetails.map(item => {
                        if (!item.product) return null;
                        const image = item.product.images?.[0];
                        return (
                            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 items-center group">
                                <div className="relative h-24 w-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                                {image && image.startsWith('http') ? (
                                    <Image
                                    src={image}
                                    alt={item.product.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                    />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-muted-foreground text-xs uppercase tracking-tighter">No img</span>
                                </div>
                                )}
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center shadow-lg border-2 border-white">{item.quantity}</span>
                                </div>
                                <div className="flex-grow space-y-1">
                                    <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                                      {item.size || 'No Size'} &middot; {item.color || 'No Color'}
                                    </p>
                                    <p className="text-sm font-bold text-primary">GH₵{item.product.price.toFixed(2)}</p>
                                </div>
                                <p className="font-black text-slate-900">GH₵{(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        )
                    })}
                    {isCartEmpty && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Your cart is empty.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-slate-50 space-y-4">
                    <div className="flex justify-between text-slate-600 font-medium">
                        <span>Subtotal</span>
                        <span>GH₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold uppercase tracking-wider text-xs">Free</span>
                    </div>
                    <Separator className="bg-slate-100" />
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">GH₵{total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    form="checkout-form"
                    type="submit" 
                    size="xl" 
                    className="w-full mt-10 rounded-2xl h-16 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all border-none"
                    disabled={isSubmitting || isCartEmpty}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay with Paystack
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      256-bit SSL Encrypted Payment
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                      Secure Payment via Paystack · Card, Mobile Money, Bank Transfer
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full">
                        <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold text-slate-600">VISA</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full">
                        <svg className="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold text-slate-600">MC</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full">
                        <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        <span className="text-[9px] font-bold text-slate-600">MTN/VODA</span>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Trust Section */}
              <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold font-headline">Powered by Paystack</span>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}
