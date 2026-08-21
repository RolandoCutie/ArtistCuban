'use client'

import { useTranslation } from '@/components/LanguageProvider'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    ArrowUpRight,
    Award,
    Globe,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react'
import { useRef } from 'react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

export default function LayoutEditorial({
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
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <>
      {/* ─── HERO CON PARALLAX ────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] w-full overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, y: imageY }}
        >
          {artist.cover_url ? (
            <img
              src={artist.cover_url}
              alt={artist.name}
              className="h-full w-full object-cover"
              style={{ filter: 'contrast(1.08) saturate(1.1)' }}
            />
          ) : (
            <div className="img-shimmer h-full w-full" />
          )}
        </motion.div>

        {/* Gradients mejorados */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }} />

        {/* Top strip con glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-10 pt-10 lg:px-20"
          style={{ opacity: contentOpacity }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-white/40 to-transparent" />
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/50 backdrop-blur-sm">Archethereum</p>
          </div>
          {artist.specialty && (
            <div className="glass rounded-full px-4 py-1.5">
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/60">{artist.specialty}</p>
            </div>
          )}
        </motion.div>

        {/* Portrait mejorado con efecto magnético */}
        {artist.photo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: -2, transition: { duration: 0.3 } }}
            className="absolute right-10 top-20 z-10 h-36 w-28 overflow-hidden shadow-2xl shadow-black/40 lg:right-20 lg:h-56 lg:w-40"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
              opacity: contentOpacity as any
            }}
          >
            <img
              src={artist.photo_url}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            {/* Ring glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-white/20 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>
        )}

        {/* Ghost number animado */}
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute bottom-12 left-10 z-0 select-none font-heading text-[20vw] font-light leading-none text-white/[0.06] lg:left-20"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.3], [0.06, 0]) as any,
            textShadow: '0 0 80px rgba(255,255,255,0.1)'
          }}
        >
          01
        </motion.p>

        {/* Name block con reveal animation */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute bottom-0 left-0 z-10 px-10 pb-16 lg:px-20"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-heading font-light leading-[0.88] text-white drop-shadow-2xl"
            style={{
              fontSize: 'clamp(52px, 9vw, 128px)',
              textShadow: '0 4px 60px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4)'
            }}
          >
            {artist.name}
          </motion.h1>
          {artist.alias && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-3 font-heading text-xl italic text-white/40 lg:text-2xl"
            >
              &ldquo;{artist.alias}&rdquo;
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-5 flex flex-wrap items-center gap-6"
          >
            {(artist.city || artist.country) && (
              <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs uppercase tracking-widest text-white/60">
                <MapPin size={10} />
                {[artist.city, artist.country].filter(Boolean).join(' · ')}
              </div>
            )}
            {artist.exhibitions_count != null && (
              <p className="text-xs uppercase tracking-widest text-white/50">
                {artist.exhibitions_count} {t.profile.exhibitionsLabel}
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-3 lg:right-20"
          style={{ opacity: contentOpacity }}
        >
          <motion.div
            animate={{ scaleY: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-14 w-px bg-gradient-to-b from-white/30 to-transparent"
          />
          <p
            className="text-[9px] uppercase tracking-[0.45em] text-white/40"
            style={{ writingMode: 'vertical-rl' }}
          >
            Descubrir
          </p>
        </motion.div>
      </section>

      {/* ─── QUOTE CON REVEAL ─────────────────────────────── */}
      {artist.inspiring_quote && (
        <section className="relative border-t border-border py-24 lg:py-40 overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-[0.02]"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, hsl(var(--foreground)) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          <div className="mx-auto max-w-5xl px-10 lg:px-20 relative">
            <div className="flex gap-10">
              {/* Decorative vertical rule animada */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 0.25, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex shrink-0 flex-col items-center gap-2 pt-1 origin-top"
              >
                <div className="h-1 w-1 rounded-full bg-foreground" />
                <div className="flex-1 w-px bg-gradient-to-b from-foreground via-foreground/50 to-transparent" />
                <div className="h-1 w-1 rounded-full bg-foreground" />
              </motion.div>

              <div>
                <motion.blockquote
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="font-heading font-light italic leading-tight text-foreground/70"
                  style={{ fontSize: 'clamp(28px, 4.5vw, 60px)' }}
                >
                  &ldquo;{artist.inspiring_quote}&rdquo;
                </motion.blockquote>
                <motion.footer
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-8 flex items-center gap-4"
                >
                  <div className="h-px w-10 bg-gradient-to-r from-foreground/20 to-transparent" />
                  <cite className="text-[10px] not-italic uppercase tracking-[0.4em] text-foreground/40">
                    {artist.name}
                  </cite>
                </motion.footer>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── BIOGRAFÍA ────────────────────────────────────── */}
      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
          {/* Section header */}
          <div className="mb-16 flex items-end justify-between">
            <div>
              <p className="select-none font-heading text-[72px] font-light leading-none text-foreground/[0.05]">
                02
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
                {t.profile.sectionBio}
              </p>
              <h2 className="mt-2 font-heading text-5xl font-light md:text-7xl">{t.profile.bioTitle}</h2>
            </div>
            {artist.is_featured && (
              <div className="hidden items-center gap-2 rounded-full border border-foreground/15 px-5 py-2 lg:flex">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/35">
                  {t.profile.featuredBadge}
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-16 lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr]">
            {/* Sidebar */}
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.45em] text-foreground/25">
                {t.profile.technicalSheet}
              </p>
              {[
                { label: t.profile.birthDate, value: artist.birth_date },
                { label: t.profile.country, value: artist.country },
                { label: t.profile.city, value: artist.city },
                { label: t.profile.specialty, value: artist.specialty },
                { label: t.profile.style, value: artist.style },
                { label: t.profile.languages, value: artist.languages?.join(', ') },
                { label: t.profile.techniques, value: artist.techniques?.join(' · ') },
                {
                  label: t.profile.exhibitions,
                  value: artist.exhibitions_count != null
                      ? t.profile.exhibitionsCount.replace('{n}', String(artist.exhibitions_count))
                      : undefined,
                },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between gap-4 border-b border-border py-4 last:border-none"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/30">
                      {item.label}
                    </span>
                    <span className="max-w-[58%] text-right text-sm leading-relaxed text-foreground/65">
                      {item.value}
                    </span>
                  </div>
                ))}

              {/* Social links */}
              {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
                <div className="pt-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/25">{t.profile.networks}</p>
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
                          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground/50 transition-colors hover:border-foreground hover:text-foreground"
                        >
                          <Globe size={10} /> {s.label}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="space-y-14">
              {artist.bio && (
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/25">
                    {t.profile.bioSection}
                  </p>
                  <p className="text-lg leading-loose text-foreground/65 lg:text-xl">{artist.bio}</p>
                </div>
              )}

              {artist.statement && (
                <div className="border-l-2 border-foreground/15 pl-8">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-foreground/25">
                    {t.profile.statement}
                  </p>
                  <p className="font-heading text-2xl italic leading-relaxed text-foreground/55">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}

              {artist.influences && artist.influences.length > 0 && (
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/25">
                    {t.profile.influences}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {artist.influences.map((inf) => (
                      <span
                        key={inf}
                        className="rounded-full border border-border px-5 py-2 text-sm text-foreground/55 transition-colors hover:border-foreground/40"
                      >
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {artist.education && artist.education.length > 0 && (
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/25">
                    {t.profile.education}
                  </p>
                  <ul className="space-y-3">
                    {artist.education.map((ed) => (
                      <li key={ed} className="flex items-start gap-3 text-sm text-foreground/55">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-foreground/25" />
                        {ed}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {artist.awards && artist.awards.length > 0 && (
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/25">
                    {t.profile.awards}
                  </p>
                  <ul className="space-y-3">
                    {artist.awards.map((aw) => (
                      <li key={aw} className="flex items-start gap-3 text-sm text-foreground/55">
                        <Award size={13} className="mt-0.5 shrink-0 text-foreground/25" />
                        {aw}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OBRAS (MASONRY) ──────────────────────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <p className="select-none font-heading text-[72px] font-light leading-none text-foreground/[0.05]">
                  03
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
                {t.profile.artworksLabel}
              </p>
              <h2 className="mt-2 font-heading text-5xl font-light md:text-7xl">{t.profile.artworksTitle}</h2>
              </div>
              <p className="hidden select-none font-heading text-[80px] font-light leading-none text-foreground/[0.08] lg:block">
                {artworks.length}
              </p>
            </div>

            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork._id}
                  className="mb-6 break-inside-avoid"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                >
                  <motion.button
                    onClick={() => openModal(artwork)}
                    whileHover={{ scale: 1.02, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative w-full overflow-hidden bg-muted shadow-lg shadow-foreground/5 hover:shadow-2xl hover:shadow-foreground/10 transition-shadow duration-500"
                    data-cursor="view"
                  >
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer aspect-[3/4]" />
                    )}
                    {/* Overlay mejorado con blur */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-[2px]">
                      <p className="font-heading text-lg leading-tight text-white drop-shadow-lg">{artwork.title}</p>
                      {artwork.year && (
                        <p className="mt-0.5 text-xs text-white/60">{artwork.year}</p>
                      )}
                      {artwork.price && !artwork.sold && (
                        <p className="mt-1 text-sm font-medium text-white drop-shadow-lg">
                          €{artwork.price.toLocaleString('es-ES')}
                        </p>
                      )}
                    </div>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    }} />
                  </motion.button>
                  <div className="mt-3 flex items-start justify-between px-0.5">
                    <div>
                      <p className="text-sm font-medium text-foreground/65">{artwork.title}</p>
                      {artwork.technique && (
                        <p className="text-xs text-foreground/35">{artwork.technique}</p>
                      )}
                    </div>
                    {artwork.sold ? (
                      <span className="text-[10px] uppercase tracking-widest text-foreground/25">
                        Vendida
                      </span>
                    ) : artwork.price ? (
                      <span className="text-sm text-foreground/55">
                        €{artwork.price.toLocaleString('es-ES')}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALERÍA HORIZONTAL INMERSIVA ─────────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border bg-foreground py-20 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-background/25">
                  {t.profile.galleryLabel}
                </p>
                <h2 className="mt-2 font-heading text-4xl font-light text-background md:text-5xl">
                  {t.profile.gallerySubtitle} <span className="italic">{artist.name}</span>
                </h2>
              </div>
              <p className="hidden text-sm text-background/25 lg:block">← →</p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="shrink-0 snap-center"
                  style={{ width: 'min(380px, 72vw)' }}
                >
                  <button
                    onClick={() => openModal(artwork)}
                    className="group relative block w-full overflow-hidden bg-white/5"
                    style={{ height: 520 }}
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
                  </button>
                  <div className="mt-4">
                    <p className="font-heading text-xl font-light text-background">{artwork.title}</p>
                    <p className="mt-1 text-xs text-background/35">
                      {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EXPOSICIONES ─────────────────────────────────── */}
      {exhibitions && exhibitions.length > 0 && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <p className="select-none font-heading text-[72px] font-light leading-none text-foreground/[0.05]">
                  04
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
                  {t.profile.exhibitionsLabel}
                </p>
                <h2 className="mt-2 font-heading text-5xl font-light md:text-7xl">{t.profile.exhibitionsTitle}</h2>
              </div>
              <span className="hidden select-none font-heading text-[80px] font-light leading-none text-foreground/[0.08] lg:block">
                {exhibitions.length}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitions.map((exhibition, i) => {
                const href = `/exposicion/${exhibition.slug || exhibition._id}`
                return (
                  <motion.a
                    key={exhibition._id}
                    href={href}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                    className="group relative overflow-hidden"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {exhibition.cover_url ? (
                        <img
                          src={exhibition.cover_url}
                          alt={exhibition.title}
                          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-foreground/5">
                          <span className="font-heading text-6xl font-light text-foreground/15">
                            {exhibition.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Status badge */}
                      {exhibition.status && (
                        <div className="absolute left-4 top-4">
                          <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-sm ${
                            exhibition.status === 'active'
                              ? 'bg-green-500/20 text-green-300'
                              : exhibition.status === 'upcoming'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-foreground/10 text-foreground/50'
                          }`}>
                            {exhibition.status === 'active' ? t.profile.exhibitionInProgress : exhibition.status === 'upcoming' ? t.profile.exhibitionUpcoming : t.profile.exhibitionPast}
                          </span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-white">
                          Ver <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="mt-4 border-b border-border pb-4">
                      <h3 className="font-heading text-xl font-light leading-tight">{exhibition.title}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-foreground/40">
                        {exhibition.date && (
                          <span>{new Date(exhibition.date).getFullYear()}</span>
                        )}
                        {exhibition.venue && (
                          <>
                            <span>·</span>
                            <span>{exhibition.venue}</span>
                          </>
                        )}
                        {exhibition.location && (
                          <>
                            <span>·</span>
                            <span>{exhibition.location}</span>
                          </>
                        )}
                      </div>
                      {exhibition.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-foreground/45 leading-relaxed">
                          {exhibition.description}
                        </p>
                      )}
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS ────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
            <div className="mb-16">
              <p className="select-none font-heading text-[72px] font-light leading-none text-foreground/[0.05]">
                04
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
                {t.profile.servicesLabel}
              </p>
              <h2 className="mt-2 font-heading text-5xl font-light md:text-7xl">
                {t.profile.servicesTitle} <span className="italic">{artist.name}</span>
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden border border-border p-8 transition-all duration-300 hover:border-foreground/35"
                >
                  <div className="absolute right-5 top-4 select-none font-heading text-[48px] font-light leading-none text-foreground/[0.05]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                  {service.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/45">
                      {service.description}
                    </p>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=${t.profile.inquireSubject} ${service.title}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/35 transition-all duration-300 hover:text-foreground group-hover:translate-x-1"
                    >
                      {t.profile.requestService} <ArrowUpRight size={13} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO ─────────────────────────────────────── */}
      <section className="border-t border-border bg-foreground py-24 lg:py-40">
        <div className="mx-auto max-w-[1600px] px-10 lg:px-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-background/25">
                {t.profile.contactLabel}
              </p>
              <h2 className="mt-4 font-heading font-light text-background"
                style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}>
                {t.profile.contactTitle}<br />
                <span className="italic">{artist.name}</span>
              </h2>
              <p className="mt-6 max-w-md leading-loose text-background/40">
                {t.profile.contactDesc}
              </p>
            </div>
            <div className="flex min-w-[220px] flex-col justify-end gap-2">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="flex items-center justify-between gap-4 border border-background/20 px-6 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={14} /> {artist.email}
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="flex items-center justify-between gap-4 border border-background/20 px-6 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={14} /> {artist.phone}
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              {artist.whatsapp && (
                <a
                  href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 border border-background/20 px-6 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={14} /> WhatsApp
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
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
