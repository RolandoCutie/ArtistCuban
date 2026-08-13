'use client'

import { motion, useAnimation } from 'framer-motion'
import {
  ArrowUpRight,
  Award,
  ChevronDown,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { useEffect } from 'react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

export default function LayoutCinematic({
  artist,
  artworks,
  services,
  modalArtwork,
  modalIndex,
  openModal,
  navigateArtwork,
  closeModal,
}: LayoutProps) {
  const kenBurnsControls = useAnimation()

  useEffect(() => {
    // Ken Burns effect: lento zoom y pan
    kenBurnsControls.start({
      scale: [1.05, 1.15],
      x: [0, -20],
      y: [0, 20],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    })
  }, [kenBurnsControls])

  return (
    <>
      {/* ─── HERO CINEMATOGRÁFICO ─────────────────────────── */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background image con Ken Burns effect */}
        <motion.div
          className="absolute inset-0"
          animate={kenBurnsControls}
        >
          {artist.cover_url ? (
            <img
              src={artist.cover_url}
              alt={artist.name}
              className="h-full w-full object-cover"
              style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.9)' }}
            />
          ) : (
            <div className="h-full w-full bg-foreground" />
          )}
        </motion.div>

        {/* Film grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Dramatic vignettes mejorados */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }} />

        {/* Top row mejorado */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-8 pt-8 lg:px-16"
        >
          <div className="glass rounded-full px-4 py-2">
            <p className="text-[9px] uppercase tracking-[0.55em] text-white/40">
              Archethereum / {artist.specialty}
            </p>
          </div>
          {artist.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }}
              className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20 shadow-2xl shadow-black/40 lg:h-20 lg:w-20"
            >
              <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
            </motion.div>
          )}
        </motion.div>

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col justify-between px-8 py-8 lg:px-16">
          {/* spacer */}
          <div />

          {/* CENTER: ARTIST NAME MASSIVE con efecto de escritura */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            {artist.alias && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-5 font-heading text-xl italic text-white/30"
              >
                &ldquo;{artist.alias}&rdquo;
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-heading font-light leading-[0.85] text-white"
              style={{
                fontSize: 'clamp(60px, 11vw, 148px)',
                textShadow: '0 8px 80px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6), 0 0 120px rgba(255,255,255,0.1)',
                letterSpacing: '-0.02em'
              }}
            >
              {artist.name}
            </motion.h1>
          </motion.div>

          {/* BOTTOM STATS BAR mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 gap-6 border-t border-white/15 pt-6 backdrop-blur-sm md:flex md:gap-12"
          >
            {[
              { label: 'País', value: artist.country },
              { label: 'Ciudad', value: artist.city },
              { label: 'Especialidad', value: artist.specialty },
              {
                label: 'Exposiciones',
                value: artist.exhibitions_count != null ? String(artist.exhibitions_count) : undefined,
              },
              { label: 'Nacimiento', value: artist.birth_date },
            ]
              .filter((i) => i.value)
              .slice(0, 5)
              .map((item, index) => (
                <motion.div
                  key={item.label}
                  className="shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <p className="text-[9px] uppercase tracking-[0.45em] text-white/30">{item.label}</p>
                  <p className="mt-1 text-sm text-white/70 font-medium">{item.value}</p>
                </motion.div>
              ))}
          </motion.div>
        </div>

        {/* Animated scroll indicator con glow */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        >
          <ChevronDown size={24} className="text-white/30 drop-shadow-lg" style={{
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
          }} />
        </motion.div>
      </section>

      {/* ─── MANIFIESTO ───────────────────────────────────── */}
      {artist.inspiring_quote && (
        <section className="bg-foreground py-24 lg:py-36">
          <div className="mx-auto max-w-5xl px-8 text-center lg:px-16">
            <p className="mb-6 text-[9px] uppercase tracking-[0.55em] text-background/20">Manifiesto</p>
            <blockquote
              className="font-heading font-light italic leading-tight text-background/65"
              style={{ fontSize: 'clamp(24px, 4vw, 52px)' }}
            >
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
            <p className="mt-8 text-[10px] uppercase tracking-[0.45em] text-background/25">
              — {artist.name}
            </p>
          </div>
        </section>
      )}

      {/* ─── SOBRE EL ARTISTA (columna única amplia) ──────── */}
      <section className="py-24 lg:py-40">
        <div className="mx-auto max-w-5xl px-8 lg:px-16">
          {artist.bio && (
            <>
              <p className="mb-5 text-[9px] uppercase tracking-[0.5em] text-foreground/25">
                01 / Sobre el artista
              </p>
              <p
                className="font-heading font-light leading-loose text-foreground/65"
                style={{ fontSize: 'clamp(22px, 2.8vw, 34px)' }}
              >
                {artist.bio}
              </p>
            </>
          )}

          {artist.statement && (
            <div className="mt-14 border-t border-border pt-14">
              <p className="mb-4 text-[9px] uppercase tracking-[0.5em] text-foreground/25">
                Declaración artística
              </p>
              <p className="text-lg leading-loose text-foreground/55">{artist.statement}</p>
            </div>
          )}

          {/* Three columns: influences / education / awards */}
          {(artist.influences?.length || artist.education?.length || artist.awards?.length) && (
            <div className="mt-16 grid gap-10 border-t border-border pt-16 md:grid-cols-3">
              {artist.influences && artist.influences.length > 0 && (
                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.45em] text-foreground/25">
                    Influencias
                  </p>
                  <div className="space-y-1.5">
                    {artist.influences.map((inf) => (
                      <p key={inf} className="text-sm text-foreground/55">
                        — {inf}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {artist.education && artist.education.length > 0 && (
                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.45em] text-foreground/25">
                    Formación
                  </p>
                  <div className="space-y-1.5">
                    {artist.education.map((ed) => (
                      <p key={ed} className="text-sm text-foreground/55">
                        — {ed}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {artist.awards && artist.awards.length > 0 && (
                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.45em] text-foreground/25">
                    Premios
                  </p>
                  <div className="space-y-2">
                    {artist.awards.map((aw) => (
                      <p key={aw} className="flex items-start gap-2 text-sm text-foreground/55">
                        <Award size={12} className="mt-0.5 shrink-0 text-foreground/25" /> {aw}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info lateral como fila de pills */}
          <div className="mt-12 flex flex-wrap gap-3">
            {[
              artist.country && `${artist.country}`,
              artist.style,
              artist.languages?.join(' · '),
              artist.techniques?.slice(0, 2).join(', '),
            ]
              .filter(Boolean)
              .map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-border px-4 py-1.5 text-xs text-foreground/45"
                >
                  {v}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ─── OBRAS — OBRA DESTACADA + GRID ────────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border">
          {/* Header */}
          <div className="mx-auto max-w-[1600px] px-8 pb-8 pt-24 lg:px-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.5em] text-foreground/25">
                  02 / Portafolio
                </p>
                <h2 className="mt-2 font-heading text-5xl font-light md:text-7xl">Obras</h2>
              </div>
              <p className="hidden select-none font-heading text-[96px] font-light leading-none text-foreground/[0.06] lg:block">
                {artworks.length}
              </p>
            </div>
          </div>

          {/* Featured artwork — full bleed */}
          <button
            onClick={() => openModal(artworks[0])}
            className="group relative block w-full overflow-hidden"
            style={{ height: 'min(80vh, 720px)' }}
          >
            {artworks[0].image_url ? (
              <img
                src={artworks[0].image_url}
                alt={artworks[0].title}
                className="h-full w-full object-cover transition-transform duration-[1.8s] group-hover:scale-105"
              />
            ) : (
              <div className="img-shimmer h-full w-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8 lg:p-16">
              <div>
                <p className="font-heading font-light text-white" style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}>
                  {artworks[0].title}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  {[artworks[0].technique, artworks[0].year].filter(Boolean).join(' · ')}
                </p>
              </div>
              {artworks[0].price && !artworks[0].sold && (
                <p className="font-heading text-3xl text-white/70">
                  €{artworks[0].price.toLocaleString('es-ES')}
                </p>
              )}
            </div>
          </button>

          {/* Remaining grid */}
          {artworks.length > 1 && (
            <div className="mx-auto max-w-[1600px] px-8 py-16 lg:px-16">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {artworks.slice(1).map((artwork) => (
                  <button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    className="group relative block aspect-[3/4] overflow-hidden bg-muted"
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
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-heading text-sm leading-tight text-white">{artwork.title}</p>
                      {artwork.year && (
                        <p className="mt-0.5 text-xs text-white/45">{artwork.year}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── SERVICIOS — lista numerada vertical ──────────── */}
      {services.length > 0 && (
        <section className="border-t border-border bg-foreground py-24 lg:py-40">
          <div className="mx-auto max-w-[1600px] px-8 lg:px-16">
            <div className="mb-16">
              <p className="text-[9px] uppercase tracking-[0.5em] text-background/25">
                03 / Servicios
              </p>
              <h2 className="mt-2 font-heading text-5xl font-light text-background md:text-7xl">
                Con <span className="italic">{artist.name}</span>
              </h2>
            </div>

            <div className="divide-y divide-background/10">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group -mx-8 flex items-center justify-between gap-8 px-8 py-7 transition-colors hover:bg-background/5 lg:-mx-16 lg:px-16"
                >
                  <div className="flex flex-1 items-start gap-8">
                    <span className="shrink-0 pt-0.5 text-[10px] uppercase tracking-widest text-background/25">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-light text-background">{service.title}</h3>
                      {service.description && (
                        <p className="mt-1 max-w-lg text-sm text-background/35">{service.description}</p>
                      )}
                    </div>
                  </div>
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="flex shrink-0 items-center gap-2 border border-background/20 px-4 py-2 text-xs uppercase tracking-widest text-background/40 opacity-0 transition-all hover:border-background hover:text-background group-hover:opacity-100"
                    >
                      Contactar <ArrowUpRight size={12} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — fondo difuminado con CTA bold ─────── */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden">
        {artist.cover_url && (
          <>
            <div className="absolute inset-0">
              <img
                src={artist.cover_url}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: 'blur(40px) brightness(0.25)' }}
              />
            </div>
            <div className="absolute inset-0 bg-foreground/65" />
          </>
        )}
        {!artist.cover_url && <div className="absolute inset-0 bg-foreground" />}

        <div className="relative z-10 w-full px-8 py-28 lg:px-16">
          <div className="mx-auto max-w-[1600px]">
            <p className="text-[9px] uppercase tracking-[0.5em] text-background/25">04 / Contacto</p>
            <h2
              className="mt-4 font-heading font-light text-background"
              style={{ fontSize: 'clamp(44px, 8vw, 112px)' }}
            >
              Hablemos.
            </h2>
            <div className="mt-10 flex flex-wrap gap-4">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="flex items-center gap-3 border border-background/25 px-8 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <Mail size={16} /> {artist.email}
                </a>
              )}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="flex items-center gap-3 border border-background/25 px-8 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <Phone size={16} /> {artist.phone}
                </a>
              )}
              {artist.whatsapp && (
                <a
                  href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-background/25 px-8 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
              {artist.social_links?.website && (
                <a
                  href={artist.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-background/25 px-8 py-4 text-sm text-background transition-all hover:bg-background hover:text-foreground"
                >
                  <Globe size={16} /> Web
                </a>
              )}
            </div>

            {/* Location */}
            {(artist.city || artist.country) && (
              <p className="mt-10 flex items-center gap-2 text-sm text-background/30">
                <MapPin size={13} />
                {[artist.city, artist.country].filter(Boolean).join(', ')}
              </p>
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
    </>
  )
}
