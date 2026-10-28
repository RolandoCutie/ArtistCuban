'use client'

import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="font-heading text-4xl leading-none text-foreground/22">{index}</span>
      <span className="text-xs uppercase tracking-[0.3em] text-foreground/45">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export default function LayoutRunway({
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
  const runwayTags = [
    artist.specialty,
    artist.style,
    ...(artist.categories ?? []),
    ...(artist.techniques?.slice(0, 2) ?? []),
  ]
    .filter(Boolean)
    .slice(0, 8) as string[]

  return (
    <div className="pb-28">
      <header className="border-b border-border px-6 pb-12 pt-14 lg:px-12 lg:pb-16">
        <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Runway Portfolio</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-heading font-light leading-[0.85]" style={{ fontSize: 'clamp(58px, 10vw, 150px)' }}>
              {artist.name}
            </h1>
            {artist.alias && <p className="mt-3 text-lg uppercase tracking-[0.24em] text-foreground/42">{artist.alias}</p>}
          </div>
          <div className="space-y-2 text-sm text-foreground/62 lg:text-right">
            {(artist.city || artist.country) && (
              <p className="flex items-center gap-2 lg:justify-end">
                <MapPin size={14} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
              </p>
            )}
            {artist.exhibitions_count != null && <p>{artist.exhibitions_count} exposiciones</p>}
          </div>
        </div>
      </header>

      {runwayTags.length > 0 && (
        <div className="overflow-hidden border-b border-border py-3">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="flex w-max"
          >
            {[0, 1].map((loop) => (
              <div key={loop} className="flex">
                {runwayTags.map((tag) => (
                  <span key={`${loop}-${tag}`} className="mx-6 inline-flex items-center gap-6 whitespace-nowrap text-xs uppercase tracking-[0.26em] text-foreground/55">
                    {tag}
                    <span className="h-1.5 w-1.5 rotate-45 bg-foreground/35" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="mx-auto mt-10 max-w-[1700px] space-y-16 px-6 lg:px-12">
        {(artist.bio || artist.statement || artist.inspiring_quote) && (
          <section className="rounded-[1.3rem] border border-border p-7 lg:p-9">
            <SectionLabel index="01" label="Narrativa" />
            {artist.bio && <p className="max-w-4xl text-base leading-loose text-foreground/76">{artist.bio}</p>}
            {artist.statement && (
              <p className="mt-6 max-w-4xl font-heading text-3xl font-light italic leading-relaxed text-foreground/62">
                &ldquo;{artist.statement}&rdquo;
              </p>
            )}
            {artist.inspiring_quote && (
              <blockquote className="mt-7 border-l-2 border-foreground/30 pl-4 font-heading text-2xl font-light text-foreground/58">
                &ldquo;{artist.inspiring_quote}&rdquo;
              </blockquote>
            )}
          </section>
        )}

        {artworks.length > 0 && (
          <section>
            <SectionLabel index="02" label="Galería Desfile" />
            <div className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3">
              {artworks.map((artwork, index) => (
                <motion.button
                  key={artwork._id}
                  onClick={() => openModal(artwork)}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group w-[82vw] shrink-0 snap-start overflow-hidden rounded-[1.2rem] border border-border bg-card text-left sm:w-[48vw] xl:w-[28vw]"
                  data-cursor="view"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
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
                    <span className="absolute left-3 top-3 rounded-full border border-background/45 bg-background/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/75 backdrop-blur">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="space-y-1 px-4 py-4">
                    <p className="font-heading text-2xl font-light">{artwork.title}</p>
                    <p className="text-sm text-foreground/55">{[artwork.technique, artwork.year].filter(Boolean).join(' · ')}</p>
                    <p className="pt-1 text-xs uppercase tracking-[0.2em] text-foreground/45">
                      {artwork.sold ? 'Vendida' : artwork.price ? `€${artwork.price.toLocaleString('es-ES')}` : 'Disponible'}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {(exhibitions.length > 0 || services.length > 0) && (
          <section className="grid gap-8 xl:grid-cols-2">
            {exhibitions.length > 0 && (
              <div className="rounded-[1.3rem] border border-border p-6">
                <SectionLabel index="03" label="Exhibiciones" />
                <div className="space-y-3">
                  {exhibitions.map((item, index) => (
                    <div key={item._id} className="rounded-xl border border-border bg-card/70 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-heading text-2xl font-light">{item.title}</p>
                          <p className="mt-1 text-sm text-foreground/56">{[item.venue, item.location].filter(Boolean).join(' · ')}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-foreground/40">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/42">
                        {[item.date, item.type].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div className="rounded-[1.3rem] border border-border p-6">
                <SectionLabel index="04" label="Servicios" />
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service._id} className="rounded-xl border border-border bg-card/70 p-4">
                      <p className="font-heading text-2xl font-light">{service.title}</p>
                      {service.description && <p className="mt-2 text-sm leading-relaxed text-foreground/58">{service.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-[1.3rem] border border-border bg-card px-7 py-8 lg:px-9">
          <SectionLabel index="05" label="Contacto" />
          <h2 className="font-heading text-4xl font-light">Activa una colaboración con el artista</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                <Mail size={14} /> Email
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:border-foreground"
              >
                <Phone size={14} /> Llamar
              </a>
            )}
            {artist.whatsapp && (
              <a
                href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:border-foreground"
              >
                <MessageCircle size={14} /> WhatsApp
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
