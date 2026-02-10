import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors">
      {children}
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
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </SocialIcon>
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </SocialIcon>
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.6 0 1.2-.3 2.3-.8 3.4H1.5c-.5-1.1-.8-2.2-.8-3.4 0-5.2 1.7-8.2 3.3-9.6C3.7 6.1 3 4 3 4H2s-.5 1.2-1.5 3.5c-.7 1.7-.8 3.5-.8 5.5 0 5.3 3.8 9.5 8.5 9.5h1c4.7 0 8.5-4.2 8.5-9.5 0-2-.1-3.8-.8-5.5C20.5 5.2 20 4 20 4h-2zM12 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path></svg>
            </SocialIcon>
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
