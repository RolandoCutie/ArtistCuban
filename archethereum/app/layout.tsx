import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Archethereum — La Plataforma Artística de Clase Mundial',
  description:
    'Descubre y conecta con los artistas más destacados del mundo. Una plataforma artística premium donde cada obra respira.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ScrollToTop />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
