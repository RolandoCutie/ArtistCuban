'use client'

import ArtistCard from '@/components/ArtistCard'
import { useTranslation } from '@/components/LanguageProvider'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

interface Artist {
  _id: string
  slug?: string
  name: string
  alias?: string
  specialty?: string
  categories?: string[]
  city?: string
  country?: string
  photo_url?: string
  exhibitions_count?: number
}

const SORT_OPTIONS_DEFAULT = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'name_desc', label: 'Nombre Z-A' },
]

interface Props {
  initialArtists: Artist[]
  categories: string[]
  initialCategory?: string
}

export default function ArtistasFilter({ initialArtists, categories, initialCategory }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(initialCategory ?? null)
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(!!initialCategory)

  const SORT_OPTIONS = [
    { value: 'recent', label: t.artists.sortRecent },
    { value: 'name', label: t.artists.sortNameAsc },
    { value: 'name_desc', label: t.artists.sortNameDesc },
  ]

  const filtered = useMemo(() => {
    let result = [...initialArtists]

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((a) =>
        [a.name, a.alias, a.specialty, a.city, a.country]
          .concat(a.categories ?? [])
          .some((v) => v?.toLowerCase().includes(q))
      )
    }

    if (categoryFilter) {
      result = result.filter((a) => (a.categories ?? []).includes(categoryFilter))
    }

    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'name_desc') result.sort((a, b) => b.name.localeCompare(a.name))

    return result
  }, [initialArtists, query, categoryFilter, sortBy])

  const clearFilters = useCallback(() => {
    setQuery('')
    setCategoryFilter(null)
    setSortBy('recent')
  }, [])

  const hasFilters = query || categoryFilter || sortBy !== 'recent'

  return (
    <>
      {/* Search & Filters — sticky */}
      <section className="sticky top-0 z-30 border-b border-border bg-background/95 py-5 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex min-w-[200px] flex-1 items-center gap-3">
              <Search size={18} className="shrink-0 text-foreground/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.artists.searchPlaceholder}
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-foreground/40"
              />
              {query && (
                <button onClick={() => setQuery('')} className="shrink-0 text-foreground/30 hover:text-foreground">
                  <X size={16} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-border bg-transparent px-4 py-2 text-xs uppercase tracking-widest text-foreground/60 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                showFilters || categoryFilter ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/60 hover:border-foreground'
              }`}
            >
              <SlidersHorizontal size={13} />
              {t.artists.filterCategories}
              {categoryFilter && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-background" />}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:text-foreground"
              >
                {t.artists.clearFilters}
              </button>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                    categoryFilter === cat
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Artists grid */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading text-3xl font-light text-foreground/30">
              {initialArtists.length === 0
                ? t.artists.comingSoon
                : t.artists.noArtistsFound}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 text-sm text-foreground/40 underline transition-colors hover:text-foreground"
              >
                {t.artists.clearFiltersBtn}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((artist, i) => (
              <ArtistCard key={String(artist._id)} artist={artist} index={i} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="mt-12 text-center text-xs text-foreground/30 uppercase tracking-widest">
            {filtered.length} {filtered.length === 1 ? t.artists.artistSingular : t.artists.artistPlural}
            {categoryFilter ? ` ${t.artists.in} ${categoryFilter}` : ''}
          </p>
        )}
      </section>
    </>
  )
}
