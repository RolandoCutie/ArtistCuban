'use client'

import { motion } from 'framer-motion'
import {
    ArrowUpRight,
    Award,
    Globe,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

/** Etiqueta de museo: placa pequeña con borde fino y serif */
function Placard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-foreground/25 bg-card px-4 py-2 ${className}`}>
      <p className="font-heading text-xs leading-snug text-foreground/70">{children}</p>
    </div>
  )
}

const SECTION_NUMS = ['01', '02', '03', '04', '05']
const SECTION_LABELS = ['Manifiesto', 'Dossier', 'Colección', 'Servicios', 'Contacto']

export default function LayoutMuseum({
  artist,
  artworks,
  services,
  modalArtwork,
  modalIndex,
  openModal,
  navigateArtwork,
  closeModal,
}: LayoutProps) {
  return (
    <>
      {/* Rail lateral fijo — guía de sala */}
      <div className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex">
        <span className="h-10 w-px bg-foreground/25" />
        {SECTION_NUMS.map((n, i) => (
          <span
            key={n}
            className={`font-heading text-xs ${i === 0 ? 'text-foreground' : 'text-foreground/25'}`}
          >
            {n}
          </span>
        ))}
        <span className="h-10 w-px bg-foreground/25" />
      </div>

      {/* Cabecera institucional */}
      <header className="relative border-b border-foreground/15 py-5">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 lg:px-24">
          <p className="text-[10px] uppercase tracking-[0.45em] text-foreground/35">
            Archeté · Museo de Arte
          </p>
          <p className="hidden text-[10px] uppercase tracking-[0.45em] text-foreground/35 md:block">
            Sala {artist.specialty || 'Contemporáneo'}
          </p>
          <p className="text-[10px] uppercase tracking-[0.45em] text-foreground/35">Nº 01</p>
        </div>
      </header>

      {/* ─── HERO — retrato de sala ───────────────────────── */}
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute -left-8 top-10 select-none font-heading text-[26vw] font-light leading-none text-foreground/[0.04]">
          {SECTION_NUMS[1]}
        </span>
        <div className="relative mx-auto grid max-w-[1600px] gap-14 px-8 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-24 lg:pb-32 lg:pt-24">
          {/* Texto + placa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="self-center"
          >
            <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-foreground/35">
              En exposición permanente
            </p>
            <h1
              className="font-heading font-light leading-[0.9]"
              style={{ fontSize: 'clamp(52px, 8.5vw, 128px)' }}
            >
              {artist.name}
            </h1>
            {artist.alias && (
              <p className="mt-4 font-heading text-xl italic text-foreground/40">
                &ldquo;{artist.alias}&rdquo;
              </p>
            )}

            {/* Placa de sala */}
            <div className="mt-10 inline-block">
              <Placard>
                {[artist.specialty, [artist.city, artist.country].filter(Boolean).join(', ')]
                  .filter(Boolean)
                  .join(' — ')}
                {artist.exhibitions_count != null && ` · ${artist.exhibitions_count} exposiciones`}
              </Placard>
            </div>
          </motion.div>

          {/* Retrato enmarcado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="border border-foreground/40 bg-card p-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : artist.cover_url ? (
                  <img src={artist.cover_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="img-shimmer h-full w-full" />
                )}
              </div>
            </div>
            <div className="mt-3 text-center">
              <Placard className="mx-auto inline-block">{artist.name} · {artist.birth_date || 's. f.'}</Placard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MANIFIESTO — placa central ───────────────────── */}
      {artist.inspiring_quote && (
        <section className="border-y border-foreground/15 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-8 text-center lg:px-24">
            <blockquote
              className="font-heading font-light italic leading-[1.2] text-foreground/60"
              style={{ fontSize: 'clamp(26px, 4vw, 50px)' }}
            >
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex justify-center">
              <Placard>— {artist.name}, declaración del artista</Placard>
            </div>
          </div>
        </section>
      )}

      {/* ─── DOSSIER — placa técnica ──────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-24">
          <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">02 / Dossier</p>
              <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Trayectoria</h2>
            </div>
            {artist.is_featured && (
              <Placard className="justify-self-start lg:justify-self-end">Artista en colección permanente</Placard>
            )}
          </div>

          <div className="grid gap-16 lg:grid-cols-[380px_1fr]">
            {/* Ficha técnica */}
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                Ficha de sala
              </p>
              <div className="divide-y divide-foreground/15 border-y border-foreground/25">
                {[
                  { label: 'Nacimiento', value: artist.birth_date },
                  { label: 'País', value: artist.country },
                  { label: 'Ciudad', value: artist.city },
                  { label: 'Especialidad', value: artist.specialty },
                  { label: 'Estilo', value: artist.style },
                  { label: 'Idiomas', value: artist.languages?.join(', ') },
                  { label: 'Técnicas', value: artist.techniques?.join(' · ') },
                ]
                  .filter((i) => i.value)
                  .map((item) => (
                    <div key={item.label} className="flex items-baseline justify-between gap-6 py-4">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35">
                        {item.label}
                      </span>
                      <span className="text-right text-sm text-foreground/60">{item.value}</span>
                    </div>
                  ))}
              </div>
              {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
                <div className="mt-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Archivo</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { href: artist.social_links.website, label: 'Web' },
                      { href: artist.social_links.instagram, label: 'Instagram' },
                      { href: artist.social_links.linkedin, label: 'LinkedIn' },
                      { href: artist.social_links.behance, label: 'Behance' },
                      { href: artist.social_links.youtube, label: 'YouTube' },
                      { href: artist.social_links.tiktok, label: 'TikTok' },
                    ]
                      .filter((s) => s.href)
                      .map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 border border-foreground/20 px-3 py-1.5 text-xs text-foreground/50 transition-colors hover:border-foreground hover:text-foreground"
                        >
                          <Globe size={10} /> {s.label}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bio + reconocimientos */}
            <div className="space-y-12">
              {artist.bio && (
                <div>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-foreground/30">Biografía</p>
                  <p className="text-lg leading-[1.9] text-foreground/60">{artist.bio}</p>
                </div>
              )}
              {artist.statement && (
                <div className="border-l-2 border-foreground/30 pl-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                    Declaración artística
                  </p>
                  <p className="font-heading text-2xl italic leading-relaxed text-foreground/55">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}
              <div className="grid gap-10 md:grid-cols-3">
                {artist.influences && artist.influences.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Influencias</p>
                    <ul className="space-y-2">
                      {artist.influences.map((inf) => (
                        <li key={inf} className="text-sm text-foreground/55">— {inf}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.education && artist.education.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Formación</p>
                    <ul className="space-y-2">
                      {artist.education.map((ed) => (
                        <li key={ed} className="text-sm text-foreground/55">— {ed}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Premios</p>
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
            </div>
          </div>
        </div>
      </section>

      {/* ─── COLECCIÓN — pared de obras colgadas ──────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-foreground/15 py-24 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-8 lg:px-24">
            <div className="mb-14 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">03 / Colección</p>
                <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Obras en sala</h2>
              </div>
              <Placard className="hidden shrink-0 lg:block">{artworks.length} piezas expuestas</Placard>
            </div>

            {/* Pared colgada: alturas alternas */}
            <div className="flex items-end gap-8 overflow-x-auto pb-8 hide-scrollbar lg:items-start">
              {artworks.map((artwork, i) => {
                const tall = i % 3 === 1
                const wide = i % 4 === 3
                return (
                  <motion.div
                    key={artwork._id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (i % 5) * 0.08 }}
                    className={`shrink-0 ${tall ? 'lg:mt-16' : ''} ${wide ? 'lg:mt-8' : ''}`}
                  >
                    <button
                      onClick={() => openModal(artwork)}
                      className="group block w-64 border border-foreground/35 bg-card p-3 transition-all duration-500 hover:border-foreground lg:w-72"
                      data-cursor="view"
                    >
                      <div
                        className={`relative overflow-hidden bg-muted ${tall ? 'aspect-[3/4]' : wide ? 'aspect-[4/3]' : 'aspect-square'}`}
                      >
                        {artwork.image_url ? (
                          <img
                            src={artwork.image_url}
                            alt={artwork.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="img-shimmer h-full w-full" />
                        )}
                      </div>
                    </button>
                    {/* Placa bajo la obra */}
                    <div className="mt-3 text-center">
                      <Placard className="mx-auto inline-block">
                        {artist.name} — {artwork.title}
                        {artwork.year ? `, ${artwork.year}` : ''}
                        {artwork.price && !artwork.sold ? ` · €${artwork.price.toLocaleString('es-ES')}` : ''}
                      </Placard>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — vitrina ──────────────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-foreground/15 py-24 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-8 lg:px-24">
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">04 / Servicios</p>
              <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Servicios del artista</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col justify-between border border-foreground/20 bg-card p-7 transition-colors hover:border-foreground/50"
                >
                  <div>
                    <p className="mb-4 select-none font-heading text-3xl font-light text-foreground/25">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-heading text-2xl font-medium">{service.title}</h3>
                    {service.description && (
                      <p className="mt-3 text-sm leading-relaxed text-foreground/45">{service.description}</p>
                    )}
                  </div>
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:text-foreground"
                    >
                      Solicitar <ArrowUpRight size={12} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — registro de visitas ───────────────── */}
      <section className="border-t border-foreground/15 py-28 lg:py-40">
        <div className="mx-auto max-w-4xl px-8 text-center lg:px-24">
          <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">05 / Contacto</p>
          <h2
            className="mt-6 font-heading font-light leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 8vw, 104px)' }}
          >
            Visite la sala
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-loose text-foreground/45">
            Adquisición de obras, préstamos para exposiciones o proyectos de colaboración.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="flex items-center gap-2 border border-foreground px-7 py-3.5 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                <Mail size={14} /> {artist.email}
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="flex items-center gap-2 border border-foreground/25 px-7 py-3.5 text-sm transition-colors hover:border-foreground"
              >
                <Phone size={14} /> {artist.phone}
              </a>
            )}
            {artist.whatsapp && (
              <a
                href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-foreground/25 px-7 py-3.5 text-sm transition-colors hover:border-foreground"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
          </div>

          {(artist.city || artist.country) && (
            <p className="mt-10 flex items-center justify-center gap-2 text-sm text-foreground/30">
              <MapPin size={13} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
            </p>
          )}
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
    </>
  )
}
