'use client'

import { motion } from 'framer-motion'
import {
    ArrowUpRight,
    Award,
    Mail,
    MapPin,
    Phone
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import { NarrativeLead, NarrativeRibbon } from './NarrativeSystem'
import type { LayoutProps } from './types'

/** Divisor: línea fina monocroma */
function Rule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-border ${className}`} />
}

export default function LayoutMinimal({
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
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
      {/* ─── ENCABEZADO — tipografía pura ─────────────────── */}
      <header className="flex items-center justify-between py-8">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Archethereum</p>
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
          {artist.exhibitions_count != null ? `${artist.exhibitions_count} exposiciones` : 'Portafolio'}
        </p>
      </header>
      <Rule />

      {/* ─── HERO — el nombre y poco más ──────────────────── */}
      <section className="grid gap-10 py-20 lg:grid-cols-[1fr_340px] lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm text-foreground/40">{artist.specialty || 'Artista'}</p>
          <h1
            className="mt-6 font-heading font-light leading-[1.0]"
            style={{ fontSize: 'clamp(48px, 7vw, 104px)' }}
          >
            {artist.name}
          </h1>
          {artist.alias && (
            <p className="mt-4 font-heading text-xl italic text-foreground/35">&ldquo;{artist.alias}&rdquo;</p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-foreground/50">
            {(artist.city || artist.country) && (
              <p className="flex items-center gap-2">
                <MapPin size={13} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
              </p>
            )}
            {artist.birth_date && <p>Nacido en {artist.birth_date}</p>}
            {artist.style && <p>{artist.style}</p>}
          </div>

          {artist.bio && (
            <p className="mt-10 max-w-2xl text-base leading-loose text-foreground/55 line-clamp-4">
              {artist.bio}
            </p>
          )}
        </motion.div>

        {/* Foto discreta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="self-start"
        >
          {(artist.photo_url || artist.cover_url) && (
            <div className="border border-border">
              <img
                src={artist.photo_url || artist.cover_url}
                alt={artist.name}
                className="aspect-square w-full max-w-[340px] object-cover"
              />
            </div>
          )}
        </motion.div>
      </section>

      <NarrativeRibbon theme="minimal" artistName={artist.name} />

      <NarrativeLead theme="minimal" stage="act2" />

      {/* ─── MANIFIESTO ───────────────────────────────────── */}
      {artist.inspiring_quote && (
        <section className="py-20">
          <Rule />
          <blockquote
            className="mx-auto max-w-3xl py-16 text-center font-heading font-light italic leading-[1.2] text-foreground/55"
            style={{ fontSize: 'clamp(24px, 3.6vw, 44px)' }}
          >
            &ldquo;{artist.inspiring_quote}&rdquo;
          </blockquote>
          <Rule />
        </section>
      )}

      {/* ─── DATOS — lista fina ───────────────────────────── */}
      <section className="py-20 lg:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/35">Datos</p>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {[
            { label: 'Nacimiento', value: artist.birth_date },
            { label: 'País', value: artist.country },
            { label: 'Ciudad', value: artist.city },
            { label: 'Especialidad', value: artist.specialty },
            { label: 'Estilo', value: artist.style },
            { label: 'Idiomas', value: artist.languages?.join(', ') },
            { label: 'Técnicas', value: artist.techniques?.join(', ') },
          ]
            .filter((i) => i.value)
            .map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-8 py-4">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/35">{item.label}</span>
                <span className="text-right text-base text-foreground/65">{item.value}</span>
              </div>
            ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {artist.influences && artist.influences.length > 0 && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/35">Influencias</p>
              <ul className="space-y-2">
                {artist.influences.map((inf) => (
                  <li key={inf} className="text-sm text-foreground/55">— {inf}</li>
                ))}
              </ul>
            </div>
          )}
          {artist.education && artist.education.length > 0 && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/35">Formación</p>
              <ul className="space-y-2">
                {artist.education.map((ed) => (
                  <li key={ed} className="text-sm text-foreground/55">— {ed}</li>
                ))}
              </ul>
            </div>
          )}
          {artist.awards && artist.awards.length > 0 && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/35">Premios</p>
              <ul className="space-y-2">
                {artist.awards.map((aw) => (
                  <li key={aw} className="flex items-start gap-2 text-sm text-foreground/55">
                    <Award size={12} className="mt-0.5 shrink-0 text-foreground/30" /> {aw}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {artist.statement && (
          <p className="mt-14 max-w-3xl font-heading text-2xl font-light italic leading-relaxed text-foreground/50">
            &ldquo;{artist.statement}&rdquo;
          </p>
        )}
      </section>

      <NarrativeLead theme="minimal" stage="act3" />

      {/* ─── OBRAS — índice de sala ───────────────────────── */}
      {artworks.length > 0 && (
        <section className="py-20 lg:py-28">
          <Rule />
          <div className="mb-10 mt-16 flex items-end justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/35">Obras ({artworks.length})</p>
            <p className="hidden text-xs text-foreground/30 sm:block">Toca una obra para ampliarla</p>
          </div>

          <div className="divide-y divide-border border-b border-border">
            {artworks.map((artwork, i) => (
              <motion.button
                key={artwork._id}
                onClick={() => openModal(artwork)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group flex w-full items-center gap-6 py-6 text-left transition-colors hover:bg-muted/50"
                data-cursor="view"
              >
                <span className="select-none text-xs text-foreground/30">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 font-heading text-2xl font-light transition-transform duration-300 group-hover:translate-x-2 lg:text-3xl">
                  {artwork.title}
                </span>
                <span className="hidden text-sm text-foreground/40 md:block">
                  {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                </span>
                <span className="shrink-0 text-sm text-foreground/50">
                  {artwork.sold ? 'Vendida' : artwork.price ? `€${artwork.price.toLocaleString('es-ES')}` : ''}
                </span>
                <span className="h-10 w-10 shrink-0 overflow-hidden border border-border opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {artwork.image_url && (
                    <img src={artwork.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-foreground/25" />
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — índices ──────────────────────────── */}
      {services.length > 0 && (
        <section className="py-20 lg:py-28">
          <Rule />
          <p className="mb-10 mt-16 text-xs uppercase tracking-[0.3em] text-foreground/35">Servicios</p>
          <div className="divide-y divide-border border-y border-border">
            {services.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-start justify-between gap-8 py-6"
              >
                <div>
                  <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                  {service.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/45">
                      {service.description}
                    </p>
                  )}
                </div>
                {artist.email && (
                  <a
                    href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                    className="shrink-0 text-sm text-foreground/45 transition-colors hover:text-foreground"
                  >
                    Solicitar ↗
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── CONTACTO — una línea ─────────────────────────── */}
      <section className="py-20 lg:py-28">
        <Rule />
        <div className="flex flex-col justify-between gap-10 py-16 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/35">Contacto</p>
            <h2
              className="mt-6 font-heading font-light leading-[0.95]"
              style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}
            >
              Trabajemos juntos.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="flex items-center gap-2 text-lg text-foreground/60 transition-colors hover:text-foreground"
              >
                <Mail size={15} /> {artist.email}
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="flex items-center gap-2 text-lg text-foreground/60 transition-colors hover:text-foreground"
              >
                <Phone size={15} /> {artist.phone}
              </a>
            )}
            {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
              <div className="mt-2 flex gap-4">
                {[
                  { href: artist.social_links.website, label: 'Web' },
                  { href: artist.social_links.instagram, label: 'Instagram' },
                  { href: artist.social_links.linkedin, label: 'LinkedIn' },
                  { href: artist.social_links.behance, label: 'Behance' },
                ]
                  .filter((s) => s.href)
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
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
