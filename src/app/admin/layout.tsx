'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Shapes, ShoppingCart, User } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Shapes },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/', label: 'Back to Store', icon: Home },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-primary/10 bg-sidebar/50 backdrop-blur-xl">
          <SidebarHeader className="p-6 border-b border-primary/10">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href} className="mb-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                      className={cn(
                        "transition-all duration-300 rounded-xl h-12",
                        isActive 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <Link href={href} className="flex items-center gap-3 px-4">
                        <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-primary")} />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-background">
          <header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <h1 className="font-headline font-bold text-xl gold-gradient-text uppercase tracking-widest">
                Admin Panel
            </h1>
            <div className="flex items-center gap-4">
               <ThemeToggle />
               <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="h-4 w-4 text-primary" />
               </div>
            </div>
          </header>
          <main className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
