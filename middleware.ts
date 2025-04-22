import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only run middleware on home page
  if (request.nextUrl.pathname === '/') {
    // Check if token exists in localStorage
    const token = request.cookies.get('token')?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Get user role from token or a separate cookie
    // For now, we'll use a role cookie, but in a real app, 
    // you might want to decode this from the JWT token
    const role = request.cookies.get('role')?.value

    // Redirect based on role
    switch (role) {
      case 'admin':
        return NextResponse.redirect(new URL('/admin', request.url))
      case 'trainer':
        return NextResponse.redirect(new URL('/trainer', request.url))
      case 'user':
        return NextResponse.redirect(new URL('/user', request.url))
      default:
        // If role is invalid, redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure matcher for the middleware
export const config = {
  matcher: '/'
} 