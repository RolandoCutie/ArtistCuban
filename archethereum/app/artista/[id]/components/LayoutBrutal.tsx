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

const BRUTAL_COLORS = ['#c2410c', '#4f46e5', '#16a34a', '#db2777', '#d97706', '#0891b2']

function BrutalTag({ children }: { children: React.ReactNode }) {
  const bg = BRUTAL_COLORS[Math.abs(String(children).length * 7) % BRUTAL_COLORS.length]
  return (
    <span
      className="inline-block px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
      style={{ background: bg, color: '#fff' }}
    >
      {children}
    </span>
  )
}

function Marquee({ items }: { items: string[] }) {
  const content = Array.from({ length: 4 }).flatMap((_, i) =>
    items.map((item) => (
      <span key={`${i}-${item}`} className="mx-6 inline-flex items-center gap-6 whitespace-nowrap">
        {item} <span className="inline-block h-2 w-2 rotate-45 bg-foreground/40" />
      </span>
    ))
  )
  return (
    <div className="overflow-hidden border-y-2 border-foreground bg-accent py-3">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex w-max"
      >
        {[0, 1].map((half) => (
          <span key={half} className="flex">
            {content}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function LayoutBrutal({
  artist,
  artworks,
  services,
  modalArtwork,
  modalIndex,
  openModal,
  navigateArtwork,
  closeModal,
}: LayoutProps) {
  const marqueeItems = [
    artist.specialty,
    artist.city,
    artist.country,
    artist.style,
    ...(artist.categories ?? []),
  ].filter(Boolean) as string[]

  return (
    <>
      {/* ─── HERO — cartel bruto ──────────────────────────── */}
      <section className="relative overflow-hidden border-b-4 border-foreground bg-background">
        {/* Giant ghost index */}
        <span className="pointer-events-none absolute -right-10 top-6 select-none font-heading text-[40vw] font-bold leading-none text-foreground/[0.04]">
          01
        </span>

        <div className="relative mx-auto grid w-full max-w-[1700px] items-center gap-14 px-6 pb-20 pt-28 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:pb-24 lg:pt-36">
          {/* Left: name poster */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block border-2 border-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              {artist.specialty || 'Artista'} / {artist.exhibitions_count != null ? `${artist.exhibitions_count} exp.` : 'Portfolio'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold uppercase leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(52px, 10vw, 150px)' }}
            >
              {artist.name}
            </motion.h1>

            {artist.alias && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-4 font-heading text-2xl font-semibold italic text-foreground/50"
              >
                a.k.a. &ldquo;{artist.alias}&rdquo;
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {(artist.categories?.length ? artist.categories : artist.techniques?.slice(0, 4) ?? []).map((c) => (
                <BrutalTag key={c}>{c}</BrutalTag>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold uppercase tracking-wider"
            >
              {(artist.city || artist.country) && (
                <p className="flex items-center gap-2">
                  <MapPin size={14} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
                </p>
              )}
              {artist.birth_date && <p>N. {artist.birth_date}</p>}
              {artist.email && (
                <a href={`mailto:${artist.email}`} className="flex items-center gap-2 underline underline-offset-4 hover:text-foreground/60">
                  <Mail size={14} /> Contacto
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: portrait card with hard shadow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="rotate-2 border-4 border-foreground bg-foreground p-3 shadow-[10px_10px_0_0_hsl(var(--foreground))] transition-transform duration-500 hover:rotate-0 hover:shadow-[14px_14px_0_0_hsl(var(--foreground))]">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {artist.photo_url ? (
                  <img
                    src={artist.photo_url}
                    alt={artist.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                  />
                ) : artist.cover_url ? (
                  <img src={artist.cover_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="img-shimmer h-full w-full" />
                )}
                <span className="absolute bottom-2 left-2 border-2 border-foreground bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  Obra viva
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        {marqueeItems.length > 0 && <Marquee items={marqueeItems} />}
      </section>

      {/* ─── MANIFIESTO — bloque de color ─────────────────── */}
      {artist.inspiring_quote && (
        <section className="bg-accent border-b-4 border-foreground py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <motion.blockquote
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(32px, 6vw, 88px)' }}
            >
              &ldquo;{artist.inspiring_quote}&rdquo;
            </motion.blockquote>
            <p className="mt-8 inline-block border-2 border-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em]">
              — {artist.name}
            </p>
          </div>
        </section>
      )}

      {/* ─── BIOGRAFÍA — ficha de datos ───────────────────── */}
      <section className="border-b-4 border-foreground py-20 lg:py-32">
        <div className="mx-auto max-w-[1700px] px-6 lg:px-12">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40">02 / Dossier</p>
              <h2 className="mt-3 font-heading text-6xl font-bold uppercase leading-none md:text-8xl">
                Datos duros
              </h2>
            </div>
            {artist.is_featured && (
              <span className="hidden shrink-0 border-2 border-foreground bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest lg:inline-block">
                ★ Destacado
              </span>
            )}
          </div>

          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Info cells */}
            <div className="grid grid-cols-2 border-l-2 border-t-2 border-foreground">
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Especialidad', value: artist.specialty },
                { label: 'Estilo', value: artist.style },
                { label: 'Exposiciones', value: artist.exhibitions_count != null ? `${artist.exhibitions_count}` : undefined },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
              ]
                .filter((i) => i.value)
                .map((item, idx) => (
                  <div
                    key={item.label}
                    className="group flex flex-col justify-between border-b-2 border-r-2 border-foreground p-5 transition-colors hover:bg-accent lg:p-6"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">
                      {String(idx + 1).padStart(2, '0')} · {item.label}
                    </p>
                    <p className="mt-4 font-heading text-xl font-semibold uppercase leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
            </div>

            {/* Bio / statement / awards */}
            <div className="flex flex-col border-2 border-foreground">
              {artist.bio && (
                <div className="border-b-2 border-foreground p-6 lg:p-8">
                  <p className="mb-4 inline-block bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
                    Biografía
                  </p>
                  <p className="text-base font-medium leading-loose text-foreground/70">{artist.bio}</p>
                </div>
              )}
              {artist.statement && (
                <div className="border-b-2 border-foreground bg-accent p-6 lg:p-8">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest">Declaración</p>
                  <p className="font-heading text-xl font-semibold italic leading-relaxed">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}
              <div className="grid gap-0 p-0 md:grid-cols-3">
                {artist.influences && artist.influences.length > 0 && (
                  <div className="border-r-0 p-6 md:border-r-2 md:border-foreground">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-foreground/45">Influencias</p>
                    <ul className="space-y-2">
                      {artist.influences.map((inf) => (
                        <li key={inf} className="text-sm font-medium text-foreground/60">— {inf}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.education && artist.education.length > 0 && (
                  <div className="border-b-2 border-foreground p-6 md:border-b-0 md:border-r-2">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-foreground/45">Formación</p>
                    <ul className="space-y-2">
                      {artist.education.map((ed) => (
                        <li key={ed} className="text-sm font-medium text-foreground/60">— {ed}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.awards && artist.awards.length > 0 && (
                  <div className="p-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-foreground/45">Premios</p>
                    <ul className="space-y-2">
                      {artist.awards.map((aw) => (
                        <li key={aw} className="flex items-start gap-2 text-sm font-medium text-foreground/60">
                          <Award size={13} className="mt-0.5 shrink-0" /> {aw}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {artist.techniques && artist.techniques.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="mr-2 text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                Técnicas:
              </span>
              {artist.techniques.map((t) => (
                <BrutalTag key={t}>{t}</BrutalTag>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── OBRAS — checklist de exposición ──────────────── */}
      {artworks.length > 0 && (
        <section className="border-b-4 border-foreground py-20 lg:py-32">
          <div className="mx-auto max-w-[1700px] px-6 lg:px-12">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40">03 / Portfolio</p>
                <h2 className="mt-3 font-heading text-6xl font-bold uppercase leading-none md:text-8xl">Obras</h2>
              </div>
              <p className="hidden select-none font-heading text-[96px] font-bold leading-none text-foreground/[0.07] lg:block">
                {artworks.length}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {artworks.map((artwork, i) => (
                <motion.button
                  key={artwork._id}
                  onClick={() => openModal(artwork)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                  className="group border-2 border-foreground bg-background p-2 text-left transition-transform duration-300 hover:-translate-y-1.5"
                  data-cursor="view"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer h-full w-full" />
                    )}
                    <span className="absolute left-1.5 top-1.5 border-2 border-foreground bg-accent px-1.5 text-[10px] font-bold leading-tight">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {artwork.price && !artwork.sold && (
                      <span className="absolute bottom-1.5 right-1.5 bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
                        €{artwork.price.toLocaleString('es-ES')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 px-1 pb-1 pt-3">
                    <div>
                      <p className="font-heading text-base font-bold uppercase leading-tight">
                        {artwork.title}
                      </p>
                      {artwork.technique && (
                        <p className="mt-0.5 text-[11px] font-medium text-foreground/40">
                          {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    {artwork.sold && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                        Vend.
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — filas brutas ─────────────────────── */}
      {services.length > 0 && (
        <section className="border-b-4 border-foreground py-20 lg:py-32">
          <div className="mx-auto max-w-[1700px] px-6 lg:px-12">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40">04 / Servicios</p>
              <h2 className="mt-3 font-heading text-6xl font-bold uppercase leading-none md:text-8xl">
                Vamos a hacerlo
              </h2>
            </div>

            <div className="border-2 border-foreground">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`group flex flex-col gap-4 p-6 transition-colors hover:bg-accent md:flex-row md:items-center md:justify-between ${
                    i > 0 ? 'border-t-2 border-foreground' : ''
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span className="select-none font-heading text-5xl font-bold leading-none text-foreground/20">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-bold uppercase">{service.title}</h3>
                      {service.description && (
                        <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-foreground/50">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="inline-flex shrink-0 items-center gap-2 border-2 border-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background md:ml-auto"
                    >
                      Contratar <ArrowUpRight size={13} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — gigante ───────────────────────────── */}
      <section className="relative overflow-hidden bg-accent py-24 lg:py-36">
        <span className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-heading text-[24vw] font-bold uppercase leading-none text-foreground/[0.06]">
          Contacto
        </span>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="inline-block border-2 border-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em]">
            Último paso
          </p>
          <h2
            className="mt-8 font-heading font-bold uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(48px, 9vw, 120px)' }}
          >
            Hablemos<span className="text-[#e11d48]">.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-medium text-foreground/60">
            Obras, residencias, exposiciones o colaboraciones. Sin rodeos.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="inline-flex flex-1 items-center justify-center gap-3 border-2 border-foreground bg-foreground px-6 py-4 text-sm font-bold uppercase tracking-widest text-background shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <Mail size={15} /> Email
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-3 border-2 border-foreground px-6 py-4 text-sm font-bold uppercase tracking-widest shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <Phone size={15} /> {artist.phone}
              </a>
            )}
            {artist.whatsapp && (
              <a
                href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-3 border-2 border-foreground px-6 py-4 text-sm font-bold uppercase tracking-widest shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
          </div>

          {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
            <div className="mt-10 flex justify-center gap-2">
              {[
                { href: artist.social_links.website, label: 'Web' },
                { href: artist.social_links.instagram, label: 'Instagram' },
                { href: artist.social_links.linkedin, label: 'LinkedIn' },
                { href: artist.social_links.behance, label: 'Behance' },
                { href: artist.social_links.youtube, label: 'YouTube' },
              ]
                .filter((s) => s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border-2 border-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                  >
                    <Globe size={11} /> {s.label}
                  </a>
                ))}
            </div>
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
