'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

export default function LayoutPrisma({
  artist,
  artworks,
  services,
  exhibitions,
  modalArtwork,
  modalIndex,
  openModal,
  navigateArtwork,
  closeModal,
}: LayoutProps) {
  const location = [artist.city, artist.country].filter(Boolean).join(', ')

  return (
    <div className="relative overflow-hidden pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-65"
        style={{
          background:
            'radial-gradient(30rem 20rem at 8% 10%, hsl(var(--accent) / 0.45), transparent 70%), radial-gradient(30rem 22rem at 92% 14%, hsl(var(--ring) / 0.38), transparent 68%), radial-gradient(28rem 18rem at 58% 82%, hsl(var(--primary) / 0.25), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1700px] px-6 pt-14 lg:px-12">
        <header className="rounded-[2rem] border border-white/20 bg-white/[0.08] p-6 backdrop-blur-xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Prisma Signature</p>
              <h1 className="mt-5 font-heading font-light leading-[0.84]" style={{ fontSize: 'clamp(58px, 9vw, 148px)' }}>
                {artist.name}
              </h1>
              {artist.alias && (
                <p className="mt-4 max-w-2xl text-base uppercase tracking-[0.22em] text-foreground/52">{artist.alias}</p>
              )}
              <div className="mt-7 flex flex-wrap gap-2">
                {(artist.categories?.length ? artist.categories : artist.techniques?.slice(0, 4) ?? []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/78"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="rounded-[1.5rem] border border-white/18 bg-background/50 p-4 backdrop-blur-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-muted">
                {artist.cover_url || artist.photo_url ? (
                  <img
                    src={artist.cover_url || artist.photo_url}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="img-shimmer h-full w-full" />
                )}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {artist.specialty && (
                  <div className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Especialidad</p>
                    <p className="mt-1 text-sm text-foreground/78">{artist.specialty}</p>
                  </div>
                )}
                {location && (
                  <div className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Ubicación</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-foreground/78">
                      <MapPin size={13} /> {location}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </header>

        {(artist.bio || artist.statement || artist.inspiring_quote) && (
          <section className="mt-9 rounded-[1.7rem] border border-white/18 bg-white/[0.06] p-7 backdrop-blur-xl lg:p-9">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Concepto</p>
            {artist.bio && <p className="mt-4 max-w-4xl text-base leading-loose text-foreground/78">{artist.bio}</p>}
            {artist.statement && (
              <p className="mt-6 max-w-4xl font-heading text-3xl font-light italic leading-relaxed text-foreground/62">
                &ldquo;{artist.statement}&rdquo;
              </p>
            )}
            {artist.inspiring_quote && (
              <blockquote className="mt-7 rounded-xl border border-white/16 bg-white/[0.08] px-5 py-4 font-heading text-2xl font-light text-foreground/62">
                &ldquo;{artist.inspiring_quote}&rdquo;
              </blockquote>
            )}
          </section>
        )}

        {artworks.length > 0 && (
          <section className="mt-11">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Portafolio Prisma</p>
                <h2 className="mt-2 font-heading text-4xl font-light">Obras destacadas</h2>
              </div>
              <p className="text-sm text-foreground/45">{artworks.length} piezas</p>
            </div>

            <div className="grid auto-rows-[220px] gap-4 md:grid-cols-2 xl:grid-cols-3">
              {artworks.map((artwork, index) => {
                const variant = index % 6
                const cardClass =
                  variant === 0
                    ? 'md:col-span-2 md:row-span-2'
                    : variant === 3
                      ? 'xl:row-span-2'
                      : ''

                return (
                  <motion.button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className={`group relative overflow-hidden rounded-[1.2rem] border border-white/20 bg-card text-left ${cardClass}`}
                    data-cursor="view"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.55))]" />
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer h-full w-full" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading text-2xl font-light text-white">{artwork.title}</p>
                        <ArrowUpRight size={16} className="mt-1 shrink-0 text-white/80" />
                      </div>
                      <p className="mt-1 text-sm text-white/75">{[artwork.technique, artwork.year].filter(Boolean).join(' · ')}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </section>
        )}

        {(services.length > 0 || exhibitions.length > 0) && (
          <section className="mt-11 grid gap-5 xl:grid-cols-2">
            {services.length > 0 && (
              <div className="rounded-[1.5rem] border border-white/18 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Servicios creativos</p>
                <div className="mt-4 space-y-3">
                  {services.map((service) => (
                    <div key={service._id} className="rounded-xl border border-white/18 bg-white/[0.08] px-4 py-4">
                      <p className="font-heading text-2xl font-light">{service.title}</p>
                      {service.description && <p className="mt-2 text-sm leading-relaxed text-foreground/66">{service.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exhibitions.length > 0 && (
              <div className="rounded-[1.5rem] border border-white/18 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Circuito expositivo</p>
                <div className="mt-4 space-y-3">
                  {exhibitions.map((item) => (
                    <div key={item._id} className="rounded-xl border border-white/18 bg-white/[0.08] px-4 py-4">
                      <p className="font-heading text-2xl font-light">{item.title}</p>
                      <p className="mt-1 text-sm text-foreground/62">{[item.venue, item.location].filter(Boolean).join(' · ')}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/45">{[item.date, item.type].filter(Boolean).join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="mt-11 rounded-[1.5rem] border border-white/18 bg-white/[0.07] px-7 py-8 backdrop-blur-xl lg:px-9">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Contacto</p>
          <h2 className="mt-2 font-heading text-4xl font-light">Lleva esta propuesta a tu proyecto</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/70 px-5 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                <Mail size={15} /> Email directo
              </a>
            )}
            {artist.social_links?.website && (
              <a
                href={artist.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2 text-sm transition-colors hover:border-foreground"
              >
                <Globe size={15} /> Sitio web
              </a>
            )}
          </div>
        </section>
      </div>

      <ArtworkModal
        artist={artist}
        artworks={artworks}
        modalArtwork={modalArtwork}
        modalIndex={modalIndex}
        navigateArtwork={navigateArtwork}
        closeModal={closeModal}
      />
    </div>
  )
}
