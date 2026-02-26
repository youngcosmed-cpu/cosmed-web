import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin pages
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Check for auth flag cookie (set by frontend on login)
  const auth = request.cookies.get('auth');

  if (!auth) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
