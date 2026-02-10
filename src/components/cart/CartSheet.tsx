"use client";

import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { products } = useProducts();
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
  const [open, setOpen] = useState(false);

  const cartDetails = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product);

  const subtotal = cartDetails.reduce((acc, item) => {
    const qty = isNaN(item.quantity) ? 0 : item.quantity;
    return acc + (item.product?.price ?? 0) * qty;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cartCount === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-xl font-medium">Your cart is empty</p>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow -mx-6 px-6">
              <div className="space-y-6 py-4">
                {cartDetails.map((item) => {
                  if (!item.product) return null;
                  const image = item.product.images?.[0];
                  return (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative h-20 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {image && image.startsWith("http") ? (
                          <Image
                            src={image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-grow space-y-1">
                        <Link 
                          href={`/product/${item.productId}`}
                          className="font-medium hover:underline line-clamp-1"
                          onClick={() => setOpen(false)}
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.size && <span>{item.size}</span>}
                          {item.size && item.color && <span> &middot; </span>}
                          {item.color && <span>{item.color}</span>}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-semibold text-sm">
                            GH₵{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive self-start"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <SheetFooter className="mt-auto pt-6 border-t flex-col gap-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>GH₵{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    View Cart
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
