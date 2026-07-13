'use client'

import { motion } from 'framer-motion'
import HeroSearch from './HeroSearch'

interface HeroProps {
  artists: {
    _id: string
    name: string
    alias?: string
    specialty?: string
    category?: string
    city?: string
    country?: string
    photo_url?: string
  }[]
}

export default function Hero({ artists }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-foreground">
      {/* Background con Ken Burns */}
      <motion.div
        className="absolute inset-0 animate-kenburns"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1920&q=90"
          alt="Hero background"
          className="h-full w-full object-cover"
          priority-fetch="high"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50"
        >
          La plataforma artística de clase mundial
        </motion.p>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-5xl font-light leading-[0.95] text-white text-balance md:text-7xl lg:text-8xl"
        >
          Donde el arte
          <br />
          <span className="italic">encuentra su público</span>
        </motion.h1>

        {/* Buscador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full max-w-2xl"
        >
          <HeroSearch artists={artists} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Descubre</span>
        <motion.div
          className="h-10 w-px bg-white/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  )
}
