import CustomCursor from '@/components/CustomCursor'
import { LanguageProvider } from '@/components/LanguageProvider'
import ScrollToTop from '@/components/ScrollToTop'
import { isValidLocale, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import ConditionalNav from './ConditionalNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Archethereum — La Plataforma Artística de Clase Mundial',
  description:
    'Descubre y conecta con los artistas más destacados del mundo. Una plataforma artística premium donde cada obra respira.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('archethereum_locale')?.value
  const initialLocale: Locale = isValidLocale(localeCookie) ? localeCookie : 'es'

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <LanguageProvider initialLocale={initialLocale}>
          <ScrollToTop />
          <CustomCursor />
          <ConditionalNav>
            {children}
          </ConditionalNav>
        </LanguageProvider>
      </body>
    </html>
  )
}
