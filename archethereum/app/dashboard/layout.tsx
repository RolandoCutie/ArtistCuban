import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { cookies } from 'next/headers'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const expected = process.env.ADMIN_SESSION_SECRET || 'archethereum-admin-secret-2026'

  // Sin cookie válida estamos en la página de login — no mostrar sidebar
  if (!token || token !== expected) return <>{children}</>
  return <DashboardLayout>{children}</DashboardLayout>
}
