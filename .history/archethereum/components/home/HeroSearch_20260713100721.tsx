'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

interface Artist {
  _id: string
  name: string
  alias?: string
  specialty?: string
  category?: string
  city?: string
  country?: string
  photo_url?: string
}

interface HeroSearchProps {
  artists: Artist[]
}

export default function HeroSearch({ artists }: HeroSearchProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return artists
      .filter((a) =>
        [a.name, a.alias, a.specialty, a.category, a.city, a.country]
          .some((v) => v?.toLowerCase().includes(q))
      )
      .slice(0, 6)
  }, [query, artists])

  const showResults = query.trim().length > 0

  return (
    <motion.div
      className="relative w-full max-w-2xl"
      animate={{ scale: showResults ? 1.02 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Input */}
      <div
        className={`flex items-center gap-4 border-b pb-4 transition-colors ${
          showResults ? 'border-white/30' : 'border-white/20'
        }`}
      >
        <Search size={24} className="shrink-0 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un artista..."
          className="flex-1 bg-transparent font-heading text-2xl font-light text-white placeholder:text-white/40 focus:outline-none md:text-3xl"
        />
        {query && (
          <button onClick={() => setQuery('')} className="shrink-0 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Resultados */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="glass absolute left-0 right-0 top-full mt-4 overflow-hidden rounded-2xl"
          >
            {results.length === 0 ? (
              <p className="p-8 text-center text-sm text-white/50">
                No encontramos artistas para &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((artist, i) => (
                <motion.div
                  key={artist._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={`/artista/${artist._id}`}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                    onClick={() => setQuery('')}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                      {artist.photo_url ? (
                        <img
                          src={artist.photo_url}
                          alt={artist.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-lg text-white truncate">{artist.name}</p>
                      {artist.specialty && (
                        <p className="text-sm text-white/50 truncate">{artist.specialty}</p>
                      )}
                      {(artist.city || artist.country) && (
                        <p className="flex items-center gap-1 text-xs text-white/40">
                          <MapPin size={10} />
                          {[artist.city, artist.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-widest text-white/70">
                      Ver Perfil
                    </span>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
