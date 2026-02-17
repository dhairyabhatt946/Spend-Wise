// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//     const session = request.cookies.get('session');
//     const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
//     const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
//                         request.nextUrl.pathname.startsWith('/register') ||
//                         request.nextUrl.pathname.startsWith('/join');

//     if(isDashboardRoute && !session) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if(isAuthRoute && session) {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/dashboard/:path*', '/login', '/register', '/join'],
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if ((pathname.startsWith('/login') || 
       pathname.startsWith('/register') || 
       pathname.startsWith('/join')) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register', '/join'],
}