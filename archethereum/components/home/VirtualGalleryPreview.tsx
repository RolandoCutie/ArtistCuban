'use client'

import { useTranslation } from '@/components/LanguageProvider'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface Exhibition {
  _id: string
  slug?: string
  title: string
  curator?: string
  artist_name?: string
  date?: string
  cover_url?: string
  status?: string
}

interface VirtualGalleryPreviewProps {
  exhibitions: Exhibition[]
}

export default function VirtualGalleryPreview({ exhibitions }: VirtualGalleryPreviewProps) {
  const { t } = useTranslation()
  const active = exhibitions.find((e) => e.status === 'active') ?? exhibitions[0]
  const rest = exhibitions.filter((e) => e._id !== active?._id).slice(0, 2)

  return (
    <section className="border-t border-border bg-foreground py-24 text-background lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-background/40">
              {t.home.galleryLabel}
            </p>
            <h2 className="font-heading text-5xl font-light leading-none text-background md:text-7xl">
              {t.home.galleryTitle} <span className="italic">{t.home.galleryTitleItalic}</span>
            </h2>
          </div>
          <Link
            href="/galeria-virtual"
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-background/60 hover:text-background transition-colors group"
          >
            {t.home.galleryViewAll}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {exhibitions.length === 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="img-shimmer aspect-[4/5] lg:row-span-2" />
            <div className="img-shimmer aspect-[16/9]" />
            <div className="img-shimmer aspect-[16/9]" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Exposición principal */}
            {active && (
              <Link
                href={`/exposicion/${active.slug || active._id}`}
                className="group relative overflow-hidden lg:row-span-2"
                data-cursor="view"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:h-full lg:aspect-auto">
                  {active.cover_url ? (
                    <img
                      src={active.cover_url}
                      alt={active.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="img-shimmer h-full w-full" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {active.status === 'active' && (
                    <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest text-white">{t.gallery.liveNowFull}</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <h3 className="font-heading text-4xl font-light text-white">{active.title}</h3>
                    {(active.curator || active.artist_name) && (
                      <p className="mt-2 text-sm text-white/60">
                        {[active.curator && `${t.gallery.curatedBy} ${active.curator}`, active.artist_name].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="glass mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-widest text-white">
                      {t.gallery.enterExhibition}
                      <ArrowUpRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Próximas */}
            {rest.map((ex) => (
              <Link
                key={ex._id}
                href={`/exposicion/${ex.slug || ex._id}`}
                className="group relative overflow-hidden"
                data-cursor="view"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {ex.cover_url ? (
                    <img
                      src={ex.cover_url}
                      alt={ex.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="img-shimmer h-full w-full" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-white/50">{t.gallery.upcoming}</p>
                    <h3 className="mt-1 font-heading text-2xl font-light text-white">{ex.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
