import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin route protection middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check for admin authentication cookie/session
    const adminAuth = request.cookies.get('admin_authenticated');
    
    // For now, allow access but in production you should implement proper auth
    // This is a placeholder that can be enhanced with Firebase Admin SDK
    if (!adminAuth && process.env.NODE_ENV === 'production') {
      // Redirect to login or show unauthorized
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
