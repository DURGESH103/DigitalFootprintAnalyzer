import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_KEY } from '@/constants';

const PROTECTED = ['/dashboard', '/analysis', '/profile', '/chat', '/compare'];
const AUTH_ONLY = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (PROTECTED.some(p => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/analysis/:path*', '/profile/:path*', '/chat/:path*', '/compare/:path*', '/login', '/signup'],
};
