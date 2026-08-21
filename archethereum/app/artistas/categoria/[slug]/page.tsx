import { findCategoryBySlug } from '@/lib/categories'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import ArtistModel from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import { ArrowLeft, ArrowUpRight, Users } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ArtistItem {
  _id: string
  slug?: string
  name: string
  specialty?: string
  categories?: string[]
  city?: string
  country?: string
  photo_url?: string
  bio?: string
}

async function getCategoryArtists(slug: string): Promise<{ artists: ArtistItem[]; total: number }> {
  try {
    await connectDB()

    const cat = findCategoryBySlug(slug)
    if (!cat) return { artists: [], total: 0 }

    const query = {
      is_active: true,
      categories: { $regex: new RegExp(`^${cat.name}$`, 'i') },
    }
    const projection = {
      _id: 1, name: 1, slug: 1, specialty: 1, categories: 1,
      city: 1, country: 1, photo_url: 1, bio: 1,
    }

    const [artists, total] = await Promise.all([
      ArtistModel.find(query, projection).sort({ created_date: -1 }).limit(48).lean(),
      ArtistModel.countDocuments(query),
    ])

    return {
      artists: JSON.parse(JSON.stringify(artists)),
      total,
    }
  } catch {
    return { artists: [], total: 0 }
  }
}

function slugifyArtist(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cat = findCategoryBySlug(slug)

  if (!cat) notFound()

  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('archethereum_locale')?.value
  const locale = isValidLocale(localeCookie) ? localeCookie : 'es'
  const t = getDictionary(locale)

  const { artists, total } = await getCategoryArtists(slug)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero de categoría */}
      <div className="relative overflow-hidden border-b border-border">
        {/* Imagen de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <img
            src={cat.image}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-32 lg:px-12">
          <Link
            href="/#categorias"
            className="group mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            {t.category.backToCategories}
          </Link>

          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">{t.category.discipline}</p>
            <h1 className="font-heading text-6xl font-light leading-none md:text-8xl lg:text-[10rem]">
              {cat.name}
            </h1>
            <p className="mt-6 max-w-xl text-xl text-foreground/60">{cat.description}</p>

            <div className="mt-8 flex items-center gap-2 text-sm text-foreground/40">
              <Users size={16} />
              <span>
                {total === 0
                  ? t.category.noArtists
                  : total === 1
                  ? t.category.artistsSingular
                  : t.category.artistsPlural.replace('{n}', String(total))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de artistas */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        {artists.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-heading text-3xl font-light text-foreground/30">
              {t.category.noArtists}
            </p>
            <p className="mt-4 text-sm text-foreground/40">
              {t.category.comingSoon.replace('{cat}', cat.name)}
            </p>
            <Link
              href="/artistas"
              className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:text-foreground"
            >
              {t.category.viewAllArtists} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist, i) => {
              const href = `/artista/${artist.slug || slugifyArtist(artist.name)}`
              const location = [artist.city, artist.country].filter(Boolean).join(', ')
              return (
                <Link
                  key={String(artist._id)}
                  href={href}
                  className="group block"
                >
                  {/* Foto */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                    {artist.photo_url ? (
                      <img
                        src={artist.photo_url}
                        alt={artist.name}
                        className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                        loading={i < 8 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      // Placeholder sin imagen
                      <div className="flex h-full w-full items-center justify-center bg-foreground/5">
                        <span className="font-heading text-5xl font-light text-foreground/20">
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Overlay hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* CTA hover */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                        <span className="text-xs uppercase tracking-widest text-white">{t.category.viewProfile}</span>
                        <ArrowUpRight size={14} className="text-white" />
                      </div>
                    </div>

                    {/* Badge categoría */}
                    {artist.categories && artist.categories.length > 1 && (
                      <div className="absolute right-3 top-3">
                        <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
                          +{artist.categories.length - 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-4">
                    <h2 className="font-heading text-xl font-medium leading-tight transition-colors group-hover:text-foreground/70">
                      {artist.name}
                    </h2>
                    <p className="mt-1 text-sm text-foreground/50">
                      {[artist.specialty, location].filter(Boolean).join(' · ')}
                    </p>
                    {artist.bio && (
                      <p className="mt-2 line-clamp-2 text-xs text-foreground/40 leading-relaxed">
                        {artist.bio}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Explorar otras categorías */}
        {artists.length > 0 && (
          <div className="mt-24 border-t border-border pt-16 text-center">
            <p className="text-sm text-foreground/40 uppercase tracking-widest">
              {t.category.exploreMore}
            </p>
            <Link
              href="/artistas"
              className="group mt-4 inline-flex items-center gap-2 font-heading text-2xl font-light transition-colors hover:text-foreground/60"
            >
              {t.category.viewAllArtists}
              <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
