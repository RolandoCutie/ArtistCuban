import CategoryExplorer from '@/components/home/CategoryExplorer'
import FeaturedArtists from '@/components/home/FeaturedArtists'
import Hero from '@/components/home/Hero'
import UpcomingEvents from '@/components/home/UpcomingEvents'
import VirtualGalleryPreview from '@/components/home/VirtualGalleryPreview'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import Artist from '@/lib/models/Artist'
import Event from '@/lib/models/Event'
import Exhibition from '@/lib/models/Exhibition'
import connectDB from '@/lib/mongodb'
import { ArrowRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getData() {
  try {
    await connectDB()
    // Only fetch fields needed for search/display — no full documents
    const searchProjection = { _id: 1, name: 1, alias: 1, slug: 1, specialty: 1, categories: 1, city: 1, country: 1, photo_url: 1 }
    const featuredProjection = { _id: 1, name: 1, slug: 1, specialty: 1, city: 1, country: 1, photo_url: 1, exhibitions_count: 1 }
    const exhibitionProjection = { _id: 1, slug: 1, title: 1, curator: 1, artist_name: 1, date: 1, cover_url: 1, status: 1 }
    const eventProjection = { _id: 1, title: 1, date: 1, time: 1, venue: 1, city: 1, country: 1, artist_name: 1, ticket_url: 1, type: 1 }

    const [artists, featuredArtists, exhibitions, events] = await Promise.all([
      Artist.find({ is_active: true }, searchProjection).sort({ createdAt: -1 }).limit(100).lean(),
      Artist.find({ is_featured: true, is_active: true }, featuredProjection).sort({ createdAt: -1 }).limit(6).lean(),
      Exhibition.find({}, exhibitionProjection).sort({ date: -1 }).limit(4).lean(),
      Event.find({}, eventProjection).sort({ date: 1 }).limit(4).lean(),
    ])
    return { artists, featuredArtists, exhibitions, events }
  } catch {
    return { artists: [], featuredArtists: [], exhibitions: [], events: [] }
  }
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('archethereum_locale')?.value
  const locale = isValidLocale(localeCookie) ? localeCookie : 'es'
  const t = getDictionary(locale)

  const { artists, featuredArtists, exhibitions, events } = await getData()

  const artistsForSearch = artists.map((a) => ({
    _id: String(a._id),
    slug: (a as { slug?: string }).slug,
    name: a.name,
    alias: a.alias,
    specialty: a.specialty,
    categories: a.categories,
    city: a.city,
    country: a.country,
    photo_url: a.photo_url,
  }))

  const featuredForDisplay = featuredArtists.map((a) => ({
    _id: String(a._id),
    slug: (a as { slug?: string }).slug,
    name: a.name,
    specialty: a.specialty,
    city: a.city,
    country: a.country,
    photo_url: a.photo_url,
    exhibitions_count: a.exhibitions_count,
  }))

  const exhibitionsForDisplay = exhibitions.map((e) => ({
    _id: String(e._id),
    slug: e.slug,
    title: e.title,
    curator: e.curator,
    artist_name: e.artist_name,
    date: e.date,
    cover_url: e.cover_url,
    status: e.status,
  }))

  const eventsForDisplay = events.map((ev) => ({
    _id: String(ev._id),
    title: ev.title,
    date: ev.date,
    time: ev.time,
    venue: ev.venue,
    city: ev.city,
    country: ev.country,
    artist_name: ev.artist_name,
    ticket_url: ev.ticket_url,
    type: ev.type,
  }))

  return (
    <>
      <Hero artists={artistsForSearch} />

      <section className="border-t border-border bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-foreground/40">{t.home.philosophyLabel}</p>
          <blockquote className="font-heading text-3xl font-light leading-tight text-balance md:text-5xl">
            {t.home.philosophyQuote}
          </blockquote>
          <Link
            href="/#artistas"
            className="group mt-12 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm uppercase tracking-widest transition-all hover:gap-4"
          >
            {t.home.philosophyCta}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <FeaturedArtists artists={featuredForDisplay} />
      <CategoryExplorer />
      <VirtualGalleryPreview exhibitions={exhibitionsForDisplay} />
      <UpcomingEvents events={eventsForDisplay} />

      <section id="contacto" className="border-t border-border bg-foreground py-24 text-background lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-background/40">{t.home.joinLabel}</p>
              <h2 className="font-heading text-5xl font-light text-background md:text-6xl">
                {t.home.joinTitle}
                <br />
                <span className="italic text-background/50">{t.home.joinSubtitle}</span>
              </h2>
              <p className="mt-6 max-w-md text-background/50">{t.home.joinDesc}</p>
              <Link
                href="/dashboard"
                className="group mt-8 inline-flex items-center gap-2 border-b border-background pb-1 text-sm uppercase tracking-widest text-background transition-all hover:gap-4"
              >
                {t.home.joinCta}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="space-y-8">
              <div className="border-t border-background/20 pt-6">
                <h3 className="font-heading text-2xl text-background">{t.home.galleriesTitle}</h3>
                <p className="mt-3 text-sm text-background/50">{t.home.galleriesDesc}</p>
              </div>
              <div className="border-t border-background/20 pt-6">
                <h3 className="font-heading text-2xl text-background">{t.home.sponsorsTitle}</h3>
                <p className="mt-3 text-sm text-background/50">{t.home.sponsorsDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
