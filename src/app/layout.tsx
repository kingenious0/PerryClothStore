import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { ProductProvider } from '@/components/product/ProductProvider';
import { CategoryProvider } from '@/components/category/CategoryProvider';
import { ImageKitProvider } from '@/components/imagekit/ImageKitProvider';

export const metadata: Metadata = {
  title: {
    default: 'PerryStore - Luxury Fashion & Clothing',
    template: '%s | PerryStore'
  },
  description: 'Discover luxury and sophistication, redefined. Shop premium fashion, clothing, and accessories at PerryStore Ghana.',
  keywords: ['fashion', 'clothing', 'luxury', 'Ghana', 'online shopping', 'e-commerce', 'premium fashion'],
  authors: [{ name: 'PerryStore' }],
  creator: 'PerryStore',
  publisher: 'PerryStore',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://perrystore.com',
    title: 'PerryStore - Luxury Fashion & Clothing',
    description: 'Discover luxury and sophistication, redefined. Shop premium fashion, clothing, and accessories.',
    siteName: 'PerryStore',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627292441194-0280c19e74e4',
        width: 1200,
        height: 630,
        alt: 'PerryStore Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PerryStore - Luxury Fashion & Clothing',
    description: 'Discover luxury and sophistication, redefined.',
    images: ['https://images.unsplash.com/photo-1627292441194-0280c19e74e4'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ImageKitProvider
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        >
            <ProductProvider>
                <CategoryProvider>
                    <CartProvider>
                    {children}
                    </CartProvider>
                </CategoryProvider>
            </ProductProvider>
        </ImageKitProvider>
        <Toaster />
      </body>
    </html>
  );
}
