import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUser = process.env.ADMIN_USERNAME || 'admin'
    const validPass = process.env.ADMIN_PASSWORD || 'admin123'
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'archethereum-admin-secret-2026'

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
