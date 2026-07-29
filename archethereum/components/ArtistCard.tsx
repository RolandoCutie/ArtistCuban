'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface ArtistCardProps {
  artist: {
    _id: string
    slug?: string
    name: string
    specialty?: string
    city?: string
    country?: string
    photo_url?: string
    exhibitions_count?: number
  }
  index?: number
}

export default function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href={`/artista/${artist.slug || artist._id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted" data-cursor="view">
          {artist.photo_url ? (
            <img
              src={artist.photo_url}
              alt={artist.name}
              className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              loading="lazy"
            />
          ) : (
            <div className="img-shimmer h-full w-full" />
          )}

          {/* Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Badge hover */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="glass flex items-center justify-between rounded-full px-5 py-3">
              <span className="text-xs uppercase tracking-widest text-white">Ver perfil</span>
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl font-medium leading-tight">{artist.name}</h3>
            <p className="mt-1 text-sm text-foreground/50">
              {[artist.specialty, artist.city && artist.country ? `${artist.city}, ${artist.country}` : (artist.city || artist.country)].filter(Boolean).join(' · ')}
            </p>
          </div>
          {typeof artist.exhibitions_count === 'number' && artist.exhibitions_count > 0 && (
            <span className="shrink-0 text-xs uppercase tracking-widest text-foreground/30">
              {artist.exhibitions_count} exp.
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
