import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-compatible JWT verification using Web Crypto API
// jsonwebtoken uses Node.js APIs and cannot run in the Edge Runtime
async function verifyEdgeToken(token: string): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-key-do-not-use-in-production'
    const [headerB64, payloadB64, sigB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !sigB64) return null

    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(
      atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    )

    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return null

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() / 1000 > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const url = request.nextUrl.clone()

  // Skip auth check for API routes — they handle auth internally
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (!token) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/warden') || url.pathname.startsWith('/student')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const payload = await verifyEdgeToken(token)
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('token', '', { maxAge: 0 })
    return response
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
  matcher: ['/admin/:path*', '/warden/:path*', '/student/:path*', '/login', '/'],
}