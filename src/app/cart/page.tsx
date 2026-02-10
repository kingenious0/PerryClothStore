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
        <div className="container mx-auto px-4 md:px-8 py-24 text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground/50" />
            <h1 className="text-4xl font-bold mt-8 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild size="lg">
                <Link href="/shop">Continue Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartDetails.map(item => {
            if (!item.product) return null;
            const image = item.product.images?.[0];
            return (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-6 items-center">
                <div className="relative h-28 w-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                  {image && image.startsWith('http') ? (
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${item.productId}`} className="font-semibold hover:underline">
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> &middot; </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      value={isNaN(item.quantity) ? '' : item.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          updateQuantity(item.productId, NaN);
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            updateQuantity(item.productId, num);
                          }
                        }
                      }}
                      className="w-20 h-9"
                    />
                     <p className="font-semibold text-lg">
                        GH₵{((item.product?.price ?? 0) * (isNaN(item.quantity) ? 0 : item.quantity)).toFixed(2)}
                     </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-28">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>GH₵{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>GH₵{subtotal.toFixed(2)}</span>
            </div>
            <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
