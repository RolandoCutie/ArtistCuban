'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
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
import { NarrativeLead, NarrativeRibbon } from './NarrativeSystem'
import type { LayoutProps } from './types'

export default function LayoutModern({
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
  // Magnetic button effect
  const MagneticButton = ({ children, href }: { children: React.ReactNode; href?: string }) => {
    const ref = useRef<HTMLAnchorElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 20, stiffness: 300 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * 0.3)
      y.set((e.clientY - centerY) * 0.3)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.a
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: xSpring, y: ySpring }}
        className="flex w-full items-center justify-between rounded-full border border-border px-5 py-3 text-sm transition-all hover:border-foreground hover:bg-foreground hover:text-background hover:shadow-2xl hover:shadow-foreground/20"
      >
        {children}
      </motion.a>
    )
  }

  return (
    <>
      {/* ─── HERO SPLIT CON EFECTOS ──────────────────────── */}
      <section className="flex min-h-screen flex-col lg:flex-row">
        {/* Image half con parallax sutil */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 flex-1 overflow-hidden lg:order-1 group"
          style={{ minHeight: '55vw', maxHeight: '100vh' }}
        >
          {artist.cover_url ? (
            <>
              <motion.img
                src={artist.cover_url}
                alt={artist.name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="h-full w-full object-cover"
              />
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </>
          ) : artist.photo_url ? (
            <motion.img
              src={artist.photo_url}
              alt={artist.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="img-shimmer h-full w-full" />
          )}

          {/* Category chips over image con animación */}
          {artist.categories && artist.categories.length > 0 && (
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {artist.categories.map((cat, i) => (
                <motion.span
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="rounded-full bg-background/95 px-4 py-1.5 text-xs text-foreground/70 backdrop-blur-md shadow-lg shadow-black/10"
                >
                  {cat}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info panel con gradient animado */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 flex flex-col justify-between bg-background px-8 py-12 lg:order-2 lg:min-h-screen lg:w-[460px] lg:px-12 lg:py-16 xl:w-[560px] overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, hsl(var(--foreground)) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, hsl(var(--foreground)) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] uppercase tracking-[0.4em] text-foreground/30 relative z-10"
          >
            Archethereum
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="py-12 lg:py-0"
          >
            {artist.specialty && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/35" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                  {artist.specialty}
                </p>
              </div>
            )}

            <h1
              className="font-heading font-light leading-[1.0]"
              style={{ fontSize: 'clamp(42px, 7vw, 80px)' }}
            >
              {artist.name}
            </h1>
            {artist.alias && (
              <p className="mt-3 font-heading text-xl italic text-foreground/35">
                &ldquo;{artist.alias}&rdquo;
              </p>
            )}

            {/* Quick info row */}
            <div className="mt-7 flex flex-wrap gap-4">
              {artist.city && (
                <div className="flex items-center gap-1.5 text-sm text-foreground/45">
                  <MapPin size={12} /> {artist.city}
                </div>
              )}
              {artist.exhibitions_count != null && (
                <div className="text-sm text-foreground/45">
                  {artist.exhibitions_count} exposiciones
                </div>
              )}
              {services.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Disponible para proyectos
                </div>
              )}
            </div>

            {/* Bio snippet */}
            {artist.bio && (
              <p className="mt-7 text-sm leading-loose text-foreground/45 line-clamp-4">
                {artist.bio}
              </p>
            )}

            {/* Technique / style pills */}
            {(artist.techniques?.length || artist.style) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {artist.style && (
                  <span className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground/55">
                    {artist.style}
                  </span>
                )}
                {artist.techniques?.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Contact + social con efecto magnético */}
          <div className="space-y-3 relative z-10">
            {artist.email && (
              <MagneticButton href={`mailto:${artist.email}`}>
                <span className="flex items-center gap-2">
                  <Mail size={14} /> Contactar
                </span>
                <ArrowUpRight size={14} />
              </MagneticButton>
            )}
            {/* Social icons row mejorados */}
            {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
              <div className="flex gap-2">
                {[
                  { href: artist.social_links.website, label: 'Web' },
                  { href: artist.social_links.instagram, label: 'Instagram' },
                  { href: artist.social_links.linkedin, label: 'LinkedIn' },
                  { href: artist.social_links.youtube, label: 'YouTube' },
                  { href: artist.social_links.behance, label: 'Behance' },
                ]
                  .filter((s) => s.href)
                  .map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.05 }}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/40 transition-all hover:border-foreground hover:text-foreground hover:shadow-lg hover:shadow-foreground/10"
                    >
                      <Globe size={13} />
                    </motion.a>
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <NarrativeRibbon theme="modern" artistName={artist.name} />

      <NarrativeLead theme="modern" stage="act2" />

      {/* ─── SOBRE EL ARTISTA (bio + info grid) ──────────── */}
      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Bio column */}
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                Sobre el artista
              </p>
              {artist.bio && (
                <p className="text-lg leading-loose text-foreground/65">{artist.bio}</p>
              )}
              {artist.statement && (
                <div className="mt-8 rounded-2xl bg-muted p-7">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Declaración
                  </p>
                  <p className="font-heading text-xl italic leading-relaxed text-foreground/55">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}
              {artist.inspiring_quote && (
                <blockquote className="mt-8 font-heading text-2xl italic leading-snug text-foreground/40">
                  &ldquo;{artist.inspiring_quote}&rdquo;
                </blockquote>
              )}
            </div>

            {/* Info bricks */}
            <div className="grid grid-cols-2 gap-3 content-start">
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                { label: 'Especialidad', value: artist.specialty },
                { label: 'Estilo', value: artist.style },
                {
                  label: 'Exposiciones',
                  value:
                    artist.exhibitions_count != null ? String(artist.exhibitions_count) : undefined,
                },
                { label: 'Técnicas', value: artist.techniques?.join(', ') },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted p-4">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-foreground/65">{item.value}</p>
                  </div>
                ))}

              {/* Influences */}
              {artist.influences && artist.influences.length > 0 && (
                <div className="col-span-2 rounded-xl bg-muted p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-foreground/30">
                    Influencias
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.influences.map((inf) => (
                      <span
                        key={inf}
                        className="rounded-full bg-background px-3 py-1 text-xs text-foreground/55 shadow-sm"
                      >
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {artist.awards && artist.awards.length > 0 && (
                <div className="col-span-2 rounded-xl bg-muted p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-foreground/30">
                    Premios
                  </p>
                  <ul className="space-y-1.5">
                    {artist.awards.map((aw) => (
                      <li key={aw} className="flex items-start gap-2 text-sm text-foreground/55">
                        <Award size={12} className="mt-0.5 shrink-0 text-foreground/25" /> {aw}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <NarrativeLead theme="modern" stage="act3" />

      {/* ─── OBRAS — bento asimétrico ─────────────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-8 lg:px-16">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Portafolio</p>
                <h2 className="mt-2 font-heading text-5xl font-light md:text-6xl">Obras</h2>
              </div>
              <p className="hidden select-none font-heading text-[80px] font-light leading-none text-foreground/[0.07] lg:block">
                {artworks.length}
              </p>
            </div>

            {/* Bento grid — large every 5th */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {artworks.map((artwork, i) => {
                const isLarge = i % 5 === 0
                return (
                  <motion.button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    className={`group relative overflow-hidden rounded-2xl bg-muted ${
                      isLarge ? 'lg:col-span-2 lg:row-span-2' : ''
                    }`}
                    style={{ aspectRatio: isLarge ? '1 / 1' : '3 / 4' }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
                  >
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer h-full w-full" />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/75 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-heading text-base leading-tight text-white">{artwork.title}</p>
                      <div className="mt-1 flex items-center justify-between">
                        {artwork.technique && (
                          <p className="text-xs text-white/45">{artwork.technique}</p>
                        )}
                        {artwork.price && !artwork.sold && (
                          <p className="text-sm font-medium text-white">
                            €{artwork.price.toLocaleString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — scroll horizontal de cards ───────── */}
      {services.length > 0 && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-8 lg:px-16">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Servicios</p>
              <h2 className="mt-2 font-heading text-5xl font-light">Colaboraciones</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {services.map((service, i) => (
                <div
                  key={service._id}
                  className="shrink-0 rounded-2xl border border-border p-7 transition-all duration-300 hover:border-foreground/35 hover:shadow-lg"
                  style={{ width: 'min(300px, 78vw)' }}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-foreground/25">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                  {service.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/45">
                      {service.description}
                    </p>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs text-background transition-colors hover:bg-foreground/80"
                    >
                      Consultar <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — rounded card ──────────────────────── */}
      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-16">
          <div className="rounded-3xl bg-muted p-10 lg:p-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Contacto</p>
                <h2 className="mt-4 font-heading text-5xl font-light">¿Hablamos?</h2>
                <p className="mt-4 leading-loose text-foreground/45">
                  Desde adquisición de obra hasta colaboraciones creativas. Contacta directamente con{' '}
                  {artist.name}.
                </p>
              </div>
              <div className="space-y-3">
                {artist.email && (
                  <a
                    href={`mailto:${artist.email}`}
                    className="flex w-full items-center justify-between rounded-2xl bg-background px-6 py-4 text-sm transition-all hover:bg-foreground hover:text-background"
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
                    className="flex w-full items-center justify-between rounded-2xl bg-background px-6 py-4 text-sm transition-all hover:bg-foreground hover:text-background"
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
                    className="flex w-full items-center justify-between rounded-2xl bg-background px-6 py-4 text-sm transition-all hover:bg-foreground hover:text-background"
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
