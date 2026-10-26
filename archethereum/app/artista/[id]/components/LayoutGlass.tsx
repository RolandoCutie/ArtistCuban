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
import { NarrativeLead, NarrativeRibbon } from './NarrativeSystem'
import type { LayoutProps } from './types'

const cardCls =
  'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl'

export default function LayoutGlass({
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
    <>
      {/* ─── HERO — esfera flotante ───────────────────────── */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Orbes de luz */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,hsl(220_30%_28%_/0.55),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,hsl(250_35%_26%_/0.5),transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/3 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,hsl(190_40%_22%_/0.4),transparent_70%)]" />

        {/* Top bar */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between px-8 py-8 lg:px-16">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">
              {artist.specialty || 'Arte'}
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {(artist.categories ?? []).slice(0, 4).map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-foreground/50 backdrop-blur-xl"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Main hero */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-14 px-8 pb-24 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:pb-16">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <div className={`${cardCls} p-4 shadow-2xl shadow-black/40`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : artist.cover_url ? (
                  <img src={artist.cover_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="img-shimmer h-full w-full" />
                )}
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/40">
                  {artist.birth_date || 'Artista contemporáneo'}
                </p>
                {artist.exhibitions_count != null && (
                  <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/40">
                    {artist.exhibitions_count} exp.
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-light leading-[0.95]"
              style={{ fontSize: 'clamp(56px, 8.5vw, 128px)' }}
            >
              {artist.name}
            </motion.h1>
            {artist.alias && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-4 font-heading text-xl italic text-foreground/40"
              >
                &ldquo;{artist.alias}&rdquo;
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {(artist.city || artist.country) && (
                <span className={`${cardCls} flex items-center gap-2 px-4 py-2 text-xs text-foreground/55`}>
                  <MapPin size={12} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
                </span>
              )}
              {artist.style && (
                <span className={`${cardCls} px-4 py-2 text-xs text-foreground/55`}>{artist.style}</span>
              )}
              {services.length > 0 && (
                <span className={`${cardCls} flex items-center gap-2 px-4 py-2 text-xs text-emerald-300`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Disponible
                </span>
              )}
            </motion.div>

            {artist.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.75 }}
                className="mt-8 max-w-lg text-base leading-loose text-foreground/45 line-clamp-4"
              >
                {artist.bio}
              </motion.p>
            )}

            {artist.email && (
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                href={`mailto:${artist.email}`}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-sm text-background shadow-xl shadow-black/30 transition-transform hover:scale-[1.03]"
              >
                <Mail size={15} /> Iniciar conversación <ArrowUpRight size={14} />
              </motion.a>
            )}
          </div>
        </div>
      </section>

      <NarrativeRibbon theme="glass" artistName={artist.name} />

      <NarrativeLead theme="glass" stage="act2" />

      {/* ─── MANIFIESTO — tarjeta de luz ──────────────────── */}
      {artist.inspiring_quote && (
        <section className="px-8 py-16 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className={`${cardCls} relative overflow-hidden p-10 lg:p-16`}>
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,hsl(250_40%_35%_/0.5),transparent_70%)]" />
              <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-foreground/35">Manifiesto</p>
              <blockquote
                className="relative font-heading font-light italic leading-tight text-foreground/70"
                style={{ fontSize: 'clamp(26px, 4vw, 52px)' }}
              >
                &ldquo;{artist.inspiring_quote}&rdquo;
              </blockquote>
              <p className="mt-8 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                — {artist.name}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── SOBRE — panel de cristal ─────────────────────── */}
      <section className="px-8 py-16 lg:px-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">Sobre el artista</p>
            <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Bio</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Bio + statement */}
            <div className="space-y-6">
              {artist.bio && (
                <div className={`${cardCls} p-8 lg:p-10`}>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Biografía</p>
                  <p className="text-base leading-loose text-foreground/60">{artist.bio}</p>
                </div>
              )}
              {artist.statement && (
                <div className={`${cardCls} p-8`}>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Declaración</p>
                  <p className="font-heading text-xl italic leading-relaxed text-foreground/55">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Ficha */}
            <div className="grid grid-cols-2 gap-4 content-start">
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                { label: 'Estilo', value: artist.style },
                { label: 'Técnicas', value: artist.techniques?.slice(0, 2).join(', ') },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div key={item.label} className={`${cardCls} p-5`}>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30">{item.label}</p>
                    <p className="mt-1 text-sm text-foreground/65">{item.value}</p>
                  </div>
                ))}
              {artist.influences && artist.influences.length > 0 && (
                <div className={`${cardCls} col-span-2 p-5`}>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-foreground/30">Influencias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.influences.map((inf) => (
                      <span key={inf} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-foreground/55">
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {artist.awards && artist.awards.length > 0 && (
                <div className={`${cardCls} col-span-2 p-5`}>
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-foreground/30">Premios</p>
                  <ul className="space-y-1.5">
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
      </section>

      <NarrativeLead theme="glass" stage="act3" />

      {/* ─── OBRAS — galería de cristal ───────────────────── */}
      {artworks.length > 0 && (
        <section className="px-8 py-16 lg:px-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">Portafolio</p>
                <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Obras</h2>
              </div>
              <p className="hidden select-none font-heading text-[80px] font-light leading-none text-foreground/[0.07] lg:block">
                {artworks.length}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {artworks.map((artwork, i) => (
                <motion.button
                  key={artwork._id}
                  onClick={() => openModal(artwork)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl bg-muted"
                  style={{ aspectRatio: i % 5 === 0 ? '1/1' : '3/4' }}
                  data-cursor="view"
                >
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="img-shimmer h-full w-full" />
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex flex-col justify-end rounded-2xl p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-heading text-lg leading-tight text-white">{artwork.title}</p>
                    <div className="mt-1 flex items-center justify-between">
                      {artwork.technique && <p className="text-xs text-white/45">{artwork.technique}</p>}
                      {artwork.price && !artwork.sold && (
                        <p className="text-sm font-medium text-white">€{artwork.price.toLocaleString('es-ES')}</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — filas de cristal ─────────────────── */}
      {services.length > 0 && (
        <section className="px-8 py-16 lg:px-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">Servicios</p>
              <h2 className="mt-4 font-heading text-5xl font-light">Colaboraciones</h2>
            </div>
            <div className="space-y-4">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className={`${cardCls} group flex flex-col gap-4 p-7 transition-colors hover:bg-white/[0.07] lg:flex-row lg:items-center lg:justify-between`}
                >
                  <div className="flex flex-1 items-start gap-5">
                    <span className="select-none font-heading text-3xl font-light text-foreground/25">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                      {service.description && (
                        <p className="mt-1 max-w-2xl text-sm text-foreground/45">{service.description}</p>
                      )}
                    </div>
                  </div>
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs text-foreground/50 transition-colors hover:border-foreground hover:text-foreground"
                    >
                      Consultar <ArrowUpRight size={12} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — panel de cierre ───────────────────── */}
      <section className="px-8 pb-24 pt-16 lg:px-16">
        <div className="mx-auto max-w-[1600px]">
          <div className={`${cardCls} relative overflow-hidden p-10 lg:p-16`}>
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,hsl(190_40%_28%_/0.5),transparent_70%)]" />
            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">Contacto</p>
                <h2
                  className="mt-4 font-heading font-light leading-[0.95]"
                  style={{ fontSize: 'clamp(44px, 6.5vw, 96px)' }}
                >
                  Colaboremos
                </h2>
                <p className="mt-6 max-w-md leading-loose text-foreground/45">
                  Un proyecto, una obra, una residencia. Hablemos de tu idea.
                </p>
              </div>
              <div className="space-y-3">
                {artist.email && (
                  <a
                    href={`mailto:${artist.email}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm transition-colors hover:border-foreground/40"
                  >
                    <span className="flex items-center gap-3"><Mail size={14} /> {artist.email}</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {artist.phone && (
                  <a
                    href={`tel:${artist.phone}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm transition-colors hover:border-foreground/40"
                  >
                    <span className="flex items-center gap-3"><Phone size={14} /> {artist.phone}</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {artist.whatsapp && (
                  <a
                    href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm transition-colors hover:border-foreground/40"
                  >
                    <span className="flex items-center gap-3"><MessageCircle size={14} /> WhatsApp</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
                  <div className="flex flex-wrap gap-2 pt-2">
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
                          className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-foreground/45 transition-colors hover:border-foreground/40"
                        >
                          <Globe size={10} /> {s.label}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>
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
    </>
  )
}
