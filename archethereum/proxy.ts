import { NextRequest, NextResponse } from 'next/server'

/**
 * Lógica de acceso al dashboard:
 *
 * Con ADMIN_SECRET_PATH configurado:
 *   - /{secretPath}            → sirve la página de login (reescritura interna)
 *   - /dashboard/login         → redirige a /{secretPath} (no exponer URL de login)
 *   - /dashboard/*             → permitido si el usuario tiene cookie de sesión válida
 *   - /dashboard/* sin cookie  → redirige a /{secretPath}
 *
 * Sin ADMIN_SECRET_PATH:
 *   - /dashboard/login         → accesible directamente
 *   - /dashboard/*             → requiere cookie válida
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secretPath = process.env.ADMIN_SECRET_PATH
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'archethereum-admin-secret-2026'
  const token = request.cookies.get('admin_token')?.value
  const isAuthenticated = !!token && token === expectedToken

  // ── Ruta secreta ──────────────────────────────────────────────────────────
  if (secretPath && pathname === `/${secretPath}`) {
    if (isAuthenticated) {
      // Ya autenticado → ir al dashboard directamente
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Reescribir a la página de login internamente
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/login'
    return NextResponse.rewrite(url)
  }

  // ── Ocultar la URL de login cuando hay ruta secreta ───────────────────────
  if (secretPath && pathname.startsWith('/dashboard/login')) {
    return NextResponse.redirect(new URL(`/${secretPath}`, request.url))
  }

  // ── Solo proteger rutas /dashboard ────────────────────────────────────────
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // ── Verificar autenticación ───────────────────────────────────────────────
  if (!isAuthenticated) {
    const loginUrl = secretPath
      ? new URL(`/${secretPath}`, request.url)
      : new URL('/dashboard/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/:secretPath([^/]+)'],
}
