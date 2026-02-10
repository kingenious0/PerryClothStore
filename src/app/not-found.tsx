import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="rounded-xl">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-xl">
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Shop
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/shop" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              Shop
            </Link>
            <Link href="/about" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              About Us
            </Link>
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              Contact
            </Link>
            <Link href="/orders" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
