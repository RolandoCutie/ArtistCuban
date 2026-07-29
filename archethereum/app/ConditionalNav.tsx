'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'

export default function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  )
}
