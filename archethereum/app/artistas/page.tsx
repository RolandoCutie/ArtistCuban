'use client'

import ArtistCard from '@/components/ArtistCard'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Artist {
  _id: string
  name: string
  alias?: string
  specialty?: string
  categories?: string[]
  city?: string
  country?: string
  photo_url?: string
  exhibitions_count?: number
}

const CATEGORIES = [
  'Pintura', 'Escultura', 'Fotografía', 'Arte Digital', 'Música',
  'Performance', 'Moda', 'Arquitectura', 'Ilustración', 'Cerámica',
  'Grabado', 'Danza', 'Teatro', 'Arte Urbano',
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'name_desc', label: 'Nombre Z-A' },
]

export default function ArtistasPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch('/api/artists')
      .then((r) => r.json())
      .then((data) => { setArtists(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = [...artists]

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
  }, [artists, query, categoryFilter, sortBy])

  const clearFilters = useCallback(() => {
    setQuery('')
    setCategoryFilter(null)
    setSortBy('recent')
  }, [])

  const hasFilters = query || categoryFilter || sortBy !== 'recent'

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Header */}
      <section className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40"
          >
            Directorio artístico
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl font-light leading-none md:text-7xl"
          >
            Artistas
            {!loading && (
              <span className="ml-4 font-heading text-2xl font-light text-foreground/30 md:text-4xl">
                ({filtered.length})
              </span>
            )}
          </motion.h1>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b border-border bg-background py-5 sticky top-0 z-30">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex flex-1 items-center gap-3 min-w-[200px]">
              <Search size={18} className="shrink-0 text-foreground/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar artistas..."
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-foreground/40"
              />
              {query && (
                <button onClick={() => setQuery('')} className="shrink-0 text-foreground/30 hover:text-foreground">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-border bg-transparent px-4 py-2 text-xs uppercase tracking-widest text-foreground/60 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                showFilters || categoryFilter ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/60 hover:border-foreground'
              }`}
            >
              <SlidersHorizontal size={13} />
              Categorías
            </button>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category pills */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {CATEGORIES.map((cat) => (
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
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="img-shimmer aspect-[3/4] rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading text-3xl font-light text-foreground/30">
              No se encontraron artistas
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 text-sm text-foreground/40 underline hover:text-foreground transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((artist, i) => (
              <ArtistCard key={artist._id} artist={artist} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
