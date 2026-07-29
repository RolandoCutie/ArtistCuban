import { NextRequest, NextResponse } from 'next/server'

/**
 * Dashboard access is protected by two layers:
 * 1. Optional secret path prefix: set ADMIN_SECRET_PATH in env (e.g. "x7k2m").
 *    The dashboard is then only reachable at /<ADMIN_SECRET_PATH>/dashboard/...
 *    Visiting /dashboard without the secret path returns 404.
 * 2. Session token cookie: validated on every request inside the dashboard.
 *
 * If ADMIN_SECRET_PATH is not set, direct /dashboard access is still protected
 * by the session token only.
 */

const PUBLIC_DASHBOARD_PATHS = ['/dashboard/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secretPath = process.env.ADMIN_SECRET_PATH

  // If ADMIN_SECRET_PATH is configured, rewrite secret path to /dashboard
  if (secretPath && pathname.startsWith(`/${secretPath}`)) {
    const rewritten = pathname.replace(`/${secretPath}`, '') || '/'
    const url = request.nextUrl.clone()
    url.pathname = rewritten.startsWith('/dashboard') ? rewritten : `/dashboard${rewritten}`
    return NextResponse.rewrite(url)
  }

  // Block direct /dashboard access when a secret path is configured
  if (secretPath && pathname.startsWith('/dashboard')) {
    return new NextResponse(null, { status: 404 })
  }

  // Only protect /dashboard routes from here
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Allow access to the login page
  if (PUBLIC_DASHBOARD_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Validate session token
  const token = request.cookies.get('admin_token')?.value
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'archethereum-admin-secret-2026'

  if (!token || token !== expectedToken) {
    const loginUrl = new URL('/dashboard/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/:secretPath(.*)/dashboard/:rest*'],
}
