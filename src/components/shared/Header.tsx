"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, LogIn, UserPlus, LogOut, Settings, Package } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { useCart } from "@/hooks/use-cart";
import { CartSheet } from "@/components/cart/CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { cartCount } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    
    // Listen to auth state changes
    try {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      }, (error) => {
        console.error('Auth state change error:', error);
        // Don't show error to user, just log it
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Auth not configured yet, that's okay
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Do not render the main header on admin pages, as they have their own layout
  if (pathname.startsWith('/admin')) {
      return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-foreground/80 hover:text-foreground transition-colors",
                pathname === link.href && "text-foreground font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {user?.photoURL ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || 'My Account'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup" className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/phone" className="cursor-pointer text-xs text-muted-foreground">
                      Sign in with Phone
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-5 text-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </CartSheet>
        </div>
      </div>
    </header>
  );
}
