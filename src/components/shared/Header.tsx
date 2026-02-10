"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, LogIn, UserPlus, LogOut, Settings, Package, Menu, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  const { cartCount } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Listen to auth state changes
    try {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      }, (error) => {
        console.error('Auth state change error:', error);
      });

      return () => {
        unsubscribe();
        window.removeEventListener("scroll", handleScroll);
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
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

  if (pathname.startsWith('/admin')) {
      return null;
  }

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b luxury-shadow h-16" 
          : "bg-transparent h-24"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-8">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm uppercase tracking-widest transition-all duration-300 group",
                pathname === link.href 
                    ? "text-primary font-bold" 
                    : "text-foreground/70 hover:text-foreground"
              )}
            >
              {link.label}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full",
                pathname === link.href && "w-full"
              )}></span>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-primary/10 transition-colors">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 transition-colors">
                {user?.photoURL ? (
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/90 backdrop-blur-md border border-primary/10">
              {user ? (
                <>
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold gold-gradient-text">
                        {user.displayName || 'My Account'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem asChild className="hover:bg-primary/5 cursor-pointer">
                    <Link href="/profile" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-primary" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-primary/5 cursor-pointer">
                    <Link href="/orders" className="w-full flex items-center">
                      <Package className="mr-2 h-4 w-4 text-primary" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="gold-gradient-text uppercase tracking-widest text-[10px] font-bold">Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem asChild className="hover:bg-primary/5 cursor-pointer">
                    <Link href="/auth/signin" className="w-full flex items-center font-medium">
                      <LogIn className="mr-2 h-4 w-4 text-primary" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-primary/5 cursor-pointer">
                    <Link href="/auth/signup" className="w-full flex items-center font-medium">
                      <UserPlus className="mr-2 h-4 w-4 text-primary" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <CartSheet>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow-lg animate-in zoom-in">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </CartSheet>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] bg-background/95 backdrop-blur-xl border-l-primary/10">
              <SheetHeader className="pb-8 border-b border-primary/10">
                <SheetTitle className="text-left font-headline font-bold text-2xl gold-gradient-text">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-xl font-headline tracking-tight py-4 px-2 rounded-xl transition-all duration-300 flex items-center justify-between group",
                      pathname === link.href 
                        ? "bg-primary/10 text-primary px-4" 
                        : "text-foreground/80 hover:bg-primary/5 hover:translate-x-2"
                    )}
                  >
                    {link.label}
                    <div className={cn(
                        "h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-opacity",
                        pathname === link.href && "opacity-100"
                    )} />
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4">
                 <Button asChild variant="outline" className="w-full rounded-full border-primary/20 hover:bg-primary/5 h-12">
                   <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                     <Package className="mr-2 h-4 w-4" />
                     My Orders
                   </Link>
                 </Button>
                 <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Follow Us</span>
                    <div className="flex gap-4">
                        {/* Social icons could go here */}
                    </div>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
