import Link from "next/link";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group transition-all", className)}>
      <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#FFD700] p-[1px] shadow-lg group-hover:scale-110 transition-transform duration-500">
        <div className="bg-background rounded-full h-full w-full flex items-center justify-center">
            <Crown className="h-5 w-5 text-[#D4AF37]" />
        </div>
      </div>
      <span className="text-2xl font-bold font-headline tracking-tighter gold-gradient-text">
        Perry<span className="text-foreground">Store</span>
      </span>
    </Link>
  );
}
