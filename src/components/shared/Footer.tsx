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
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4 py-16 md:px-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Luxury and sophistication, redefined.
          </p>
          <div className="flex gap-4 mt-2">
            <SocialIcon href="https://facebook.com" icon={Facebook} />
            <SocialIcon href="https://instagram.com" icon={Instagram} />
            <SocialIcon href="https://twitter.com" icon={Twitter} />
          </div>
        </div>
        <div>
          <h4 className="font-headline font-semibold mb-4">Shop</h4>
          <ul className="space-y-3">
            <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
            <li><Link href="/shop?category=apparel" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Apparel</Link></li>
            <li><Link href="/shop?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
            <li><Link href="/shop?category=footwear" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Footwear</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-semibold mb-4">Company</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
             <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin Panel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Subscribe to our newsletter for exclusive updates.</p>
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="bg-background" />
            <Button type="submit" variant="default">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex justify-between items-center px-4 py-6 md:px-8">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PerryStore. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
