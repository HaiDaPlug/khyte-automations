import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/internal/:path*',
    {
      source: '/(.*)',
      has: [{ type: 'header', key: 'host', value: 'internal\\.khyte\\.se' }],
    },
  ],
}

function deny(): NextResponse {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Khyte Internal"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'private, no-store',
    },
  })
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isInternalHost = host === 'internal.khyte.se'
  const path = request.nextUrl.pathname

  // Let Next.js internals and public signature images pass through without auth.
  // Rewriting these would break the page load on internal.khyte.se.
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/signature-assets/') ||
    path === '/favicon.ico' ||
    path === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Basic ')) return deny()

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
  const colonIdx = decoded.indexOf(':')
  if (colonIdx === -1) return deny()

  const user = decoded.slice(0, colonIdx)
  const pass = decoded.slice(colonIdx + 1)
  const expectedUser = process.env.SIGNATURE_TOOL_USER
  const expectedPass = process.env.SIGNATURE_TOOL_PASSWORD

  if (!expectedUser || user !== expectedUser || pass !== expectedPass) return deny()

  // Rewrite all non-internal paths on the subdomain to the builder page.
  // This prevents internal.khyte.se/about from accidentally serving the public site.
  if (isInternalHost && !path.startsWith('/internal')) {
    const url = request.nextUrl.clone()
    url.pathname = '/internal/signatures'
    const res = NextResponse.rewrite(url)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    res.headers.set('Cache-Control', 'private, no-store')
    return res
  }

  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'private, no-store')
  return res
}
