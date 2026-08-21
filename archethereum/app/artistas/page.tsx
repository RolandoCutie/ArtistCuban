import { categories } from '@/lib/categories'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import ArtistModel from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import { cookies } from 'next/headers'
import ArtistasFilter from './ArtistasFilter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getArtists() {
  try {
    await connectDB()
    const projection = {
      _id: 1, name: 1, alias: 1, slug: 1, specialty: 1,
      categories: 1, city: 1, country: 1, photo_url: 1, exhibitions_count: 1,
    }
    const artists = await ArtistModel
      .find({ is_active: true }, projection)
      .sort({ createdAt: -1 })
      .lean()
    return JSON.parse(JSON.stringify(artists))
  } catch {
    return []
  }
}

export default async function ArtistasPage({
  searchParams,
}: {
  searchParams?: Promise<{ categoria?: string }>
}) {
  const params = await searchParams
  const initialCategory = params?.categoria ?? undefined
  const artists = await getArtists()
  const categoryNames = categories.map((c) => c.name)

  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('archethereum_locale')?.value
  const locale = isValidLocale(localeCookie) ? localeCookie : 'es'
  const t = getDictionary(locale)

  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">
            {t.artists.directoryLabel}
          </p>
          <h1 className="font-heading text-5xl font-light leading-none md:text-7xl">
            {t.artists.title}
            <span className="ml-4 font-heading text-2xl font-light text-foreground/30 md:text-4xl">
              ({artists.length})
            </span>
          </h1>
        </div>
      </section>

      <ArtistasFilter
        initialArtists={artists}
        categories={categoryNames}
        initialCategory={initialCategory}
      />
    </div>
  )
}
