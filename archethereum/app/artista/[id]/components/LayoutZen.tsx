'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

function VerticalRule() {
  return <div className="h-16 w-px bg-border/80" />
}

export default function LayoutZen({
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
  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-28 pt-12 lg:px-10">
      <header className="grid gap-8 border-b border-border pb-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/45">Zen Ink</p>
          <h1 className="mt-6 font-heading font-light leading-[0.9]" style={{ fontSize: 'clamp(56px, 8vw, 120px)' }}>
            {artist.name}
          </h1>
          {artist.alias && (
            <p className="mt-4 font-heading text-xl italic text-foreground/42">&ldquo;{artist.alias}&rdquo;</p>
          )}
        </div>
        <div className="space-y-2 text-sm text-foreground/62 md:text-right">
          {artist.specialty && <p>{artist.specialty}</p>}
          {(artist.city || artist.country) && (
            <p className="flex items-center gap-2 md:justify-end">
              <MapPin size={14} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
            </p>
          )}
          {artist.birth_date && <p>{artist.birth_date}</p>}
        </div>
      </header>

      <section className="py-14">
        <div className="mx-auto max-w-4xl text-center">
          {artist.bio && <p className="text-base leading-loose text-foreground/74">{artist.bio}</p>}
          {artist.statement && (
            <p className="mt-8 font-heading text-3xl font-light italic leading-relaxed text-foreground/58">
              &ldquo;{artist.statement}&rdquo;
            </p>
          )}
          {artist.inspiring_quote && (
            <blockquote className="mt-9 font-heading text-4xl font-light leading-tight text-foreground/48">
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
          )}
        </div>
      </section>

      {(artist.influences?.length || artist.techniques?.length || artist.education?.length) && (
        <section className="border-y border-border py-12">
          <div className="grid gap-10 md:grid-cols-3">
            {artist.influences && artist.influences.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Influencias</p>
                <ul className="mt-4 space-y-2">
                  {artist.influences.map((item) => (
                    <li key={item} className="text-sm text-foreground/65">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {artist.techniques && artist.techniques.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Técnicas</p>
                <ul className="mt-4 space-y-2">
                  {artist.techniques.map((item) => (
                    <li key={item} className="text-sm text-foreground/65">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {artist.education && artist.education.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Formación</p>
                <ul className="mt-4 space-y-2">
                  {artist.education.map((item) => (
                    <li key={item} className="text-sm text-foreground/65">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {artworks.length > 0 && (
        <section className="py-14">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Colección</p>
            <h2 className="mt-3 font-heading text-4xl font-light">Obras</h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {artworks.map((artwork, index) => (
              <motion.button
                key={artwork._id}
                onClick={() => openModal(artwork)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="group grid w-full gap-4 border-b border-border pb-6 text-left md:grid-cols-[120px_1fr_auto]"
                data-cursor="view"
              >
                <div className="overflow-hidden rounded-lg bg-muted">
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="img-shimmer aspect-square w-full" />
                  )}
                </div>

                <div>
                  <p className="font-heading text-3xl font-light leading-tight">{artwork.title}</p>
                  <p className="mt-2 text-sm text-foreground/55">{[artwork.technique, artwork.material].filter(Boolean).join(' · ')}</p>
                </div>

                <div className="flex items-center justify-between gap-4 md:block md:text-right">
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                    {artwork.year || 's.f.'}
                  </p>
                  <p className="mt-1 text-sm text-foreground/58">
                    {artwork.sold ? 'Vendida' : artwork.price ? `€${artwork.price.toLocaleString('es-ES')}` : 'Disponible'}
                  </p>
                  <ArrowUpRight size={15} className="mt-2 hidden text-foreground/40 md:inline-block" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {(services.length > 0 || exhibitions.length > 0) && (
        <section className="border-y border-border py-12">
          <div className="grid gap-10 md:grid-cols-2">
            {services.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Servicios</p>
                <div className="mt-4 space-y-4">
                  {services.map((service) => (
                    <div key={service._id}>
                      <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                      {service.description && <p className="mt-1 text-sm leading-relaxed text-foreground/58">{service.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exhibitions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Exhibiciones</p>
                <div className="mt-4 space-y-4">
                  {exhibitions.map((item) => (
                    <div key={item._id}>
                      <h3 className="font-heading text-2xl font-light">{item.title}</h3>
                      <p className="mt-1 text-sm text-foreground/58">{[item.venue, item.location].filter(Boolean).join(' · ')}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-foreground/45">
                        {[item.date, item.type].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <VerticalRule />
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Contacto</p>
          <h2 className="font-heading text-4xl font-light">Disponible para proyectos curatoriales</h2>
          <div className="flex flex-wrap justify-center gap-3">
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
                <Phone size={14} /> Teléfono
              </a>
            )}
          </div>
        </div>
      </section>

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
