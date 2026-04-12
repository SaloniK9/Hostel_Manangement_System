import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const url = request.nextUrl.clone()

  if (!token) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/warden') || url.pathname.startsWith('/student')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const payload = verifyToken(token)
  if (!payload) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (url.pathname === '/login' || url.pathname === '/') {
    switch (payload.role) {
      case 'ADMIN':
        url.pathname = '/admin'
        break
      case 'WARDEN':
        url.pathname = '/warden'
        break
      case 'STUDENT':
        url.pathname = '/student'
        break
    }
    return NextResponse.redirect(url)
  }

  if (payload.role === 'ADMIN' && url.pathname.startsWith('/warden')) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  if (payload.role === 'WARDEN' && url.pathname.startsWith('/admin')) {
    url.pathname = '/warden'
    return NextResponse.redirect(url)
  }
  if (payload.role === 'STUDENT' && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/warden'))) {
    url.pathname = '/student'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/warden/:path*', '/student/:path*', '/api/:path*'],
}