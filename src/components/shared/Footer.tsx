import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

function SocialIcon({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <Link 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-primary/10 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4 py-20 md:px-8 relative z-10">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Experience the pinnacle of fashion. Luxury and sophistication, redefined for the modern connoisseur.
          </p>
          <div className="flex gap-4">
            <SocialIcon href="https://facebook.com" icon={Facebook} />
            <SocialIcon href="https://instagram.com" icon={Instagram} />
            <SocialIcon href="https://twitter.com" icon={Twitter} />
          </div>
        </div>
        
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-8 gold-gradient-text">Collection</h4>
          <ul className="space-y-4">
            <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">New Arrivals</Link></li>
            <li><Link href="/shop?category=mens" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Men's Collection</Link></li>
            <li><Link href="/shop?category=womens" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Women's Collection</Link></li>
            <li><Link href="/shop?category=accessories" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Exclusive Accessories</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-8 gold-gradient-text">The Brand</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
            <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Admin Portal</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">Careers</Link></li>
          </ul>
        </div>
        
        <div className="bg-primary/[0.03] p-8 rounded-3xl border border-primary/10">
          <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-4 gold-gradient-text">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Join our inner circle for exclusive previews and offers.</p>
          <form className="flex flex-col gap-3">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-background border-primary/20 rounded-full h-12 focus-visible:ring-primary shadow-sm" 
            />
            <Button type="submit" variant="default" className="rounded-full h-12 font-bold gold-gradient shadow-lg hover:scale-105 transition-transform">
              Join Now
            </Button>
          </form>
        </div>
      </div>
      
      <div className="border-t border-primary/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-10 md:px-8">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
            &copy; {new Date().getFullYear()} PerryStore. All rights reserved. Ghana's Premier Luxury Destination.
          </p>
          <div className="flex gap-8 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
