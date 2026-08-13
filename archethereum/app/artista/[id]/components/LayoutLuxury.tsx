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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-14 bg-foreground/20" />
      <span className="h-1.5 w-1.5 rotate-45 border border-foreground/30 bg-background" />
      <span className="h-px w-14 bg-foreground/20" />
    </div>
  )
}

export default function LayoutLuxury({
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
      {/* ─── PORTADA ───────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Tenue cover background */}
        {artist.cover_url && (
          <div className="pointer-events-none absolute inset-0">
            <img
              src={artist.cover_url}
              alt=""
              className="h-full w-full object-cover opacity-[0.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
          </div>
        )}

        {/* Corner marks */}
        <div className="pointer-events-none absolute left-8 top-8 hidden h-6 w-6 border-l border-t border-foreground/20 lg:block" />
        <div className="pointer-events-none absolute right-8 top-8 hidden h-6 w-6 border-r border-t border-foreground/20 lg:block" />
        <div className="pointer-events-none absolute bottom-8 left-8 hidden h-6 w-6 border-b border-l border-foreground/20 lg:block" />
        <div className="pointer-events-none absolute bottom-8 right-8 hidden h-6 w-6 border-b border-r border-foreground/20 lg:block" />

        <div className="relative mx-auto grid w-full max-w-[1700px] flex-1 items-center gap-16 px-8 pb-24 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:pb-16 lg:pt-40">
          {/* Left: name block */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-10 bg-foreground/30" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40">
                Galería privada · {artist.specialty || 'Arte'}
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 font-heading font-light leading-[0.92]"
              style={{ fontSize: 'clamp(58px, 9.5vw, 150px)' }}
            >
              {artist.name}
            </motion.h1>

            {artist.alias && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-5 font-heading text-2xl italic text-foreground/40"
              >
                &ldquo;{artist.alias}&rdquo;
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-x-10 gap-y-4"
            >
              {(artist.city || artist.country) && (
                <p className="flex items-center gap-2 text-sm text-foreground/50">
                  <MapPin size={13} />
                  {[artist.city, artist.country].filter(Boolean).join(', ')}
                </p>
              )}
              {artist.exhibitions_count != null && (
                <p className="text-sm text-foreground/50">
                  {artist.exhibitions_count} exposiciones registradas
                </p>
              )}
              {artist.birth_date && (
                <p className="text-sm text-foreground/50">N. {artist.birth_date}</p>
              )}
            </motion.div>

            {artist.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.75 }}
                className="mt-8 max-w-lg text-base leading-loose text-foreground/45 line-clamp-3"
              >
                {artist.bio}
              </motion.p>
            )}
          </div>

          {/* Right: framed portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Outer frame */}
            <div className="border border-foreground/15 p-3 lg:p-4">
              <div className="border border-foreground/10 p-2 lg:p-3">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {artist.photo_url ? (
                    <img
                      src={artist.photo_url}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : artist.cover_url ? (
                    <img
                      src={artist.cover_url}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="img-shimmer h-full w-full" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Collection plate */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border border-foreground/20 bg-background px-6 py-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                Obra &amp; artista Nº 01
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom index rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative mx-auto hidden w-full max-w-[1700px] items-center gap-4 px-16 pb-8 lg:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.45em] text-foreground/30">
            Col·lecció
          </span>
          <span className="h-px flex-1 bg-foreground/15" />
          <span className="text-[10px] uppercase tracking-[0.45em] text-foreground/30">
            MMXXVI
          </span>
        </motion.div>
      </section>

      {/* ─── MANIFIESTO ───────────────────────────────────── */}
      {artist.inspiring_quote && (
        <section className="border-t border-border py-24 lg:py-36">
          <div className="mx-auto max-w-4xl px-8 lg:px-16">
            <Ornament />
            <blockquote
              className="mt-12 text-center font-heading font-light italic leading-[1.15] text-foreground/65"
              style={{ fontSize: 'clamp(28px, 4.5vw, 58px)' }}
            >
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
            <footer className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-foreground/20" />
              <cite className="text-[10px] not-italic uppercase tracking-[0.45em] text-foreground/35">
                {artist.name}
              </cite>
              <span className="h-px w-8 bg-foreground/20" />
            </footer>
          </div>
        </section>
      )}

      {/* ─── BIOGRAFÍA — ficha de coleccionista ───────────── */}
      <section className="border-t border-border py-24 lg:py-36">
        <div className="mx-auto max-w-[1700px] px-8 lg:px-16">
          <div className="mb-20 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">
                02 / Dossier
              </p>
              <h2 className="mt-4 font-heading font-light leading-none" style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>
                Biografía
              </h2>
            </div>
            {artist.is_featured && (
              <div className="flex items-center gap-3 border border-foreground/15 px-5 py-2.5">
                <span className="h-1.5 w-1.5 rotate-45 bg-foreground/40" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/45">
                  Artista de la colección
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-16 lg:grid-cols-[340px_1fr]">
            {/* Ficha técnica */}
            <div>
              <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                Ficha técnica
              </p>
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Especialidad', value: artist.specialty },
                { label: 'Estilo', value: artist.style },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                { label: 'Técnicas', value: artist.techniques?.join(' · ') },
                {
                  label: 'Exposiciones',
                  value: artist.exhibitions_count != null ? String(artist.exhibitions_count) : undefined,
                },
              ]
                .filter((i) => i.value)
                .map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between gap-6 border-b border-border py-4 last:border-none"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/30">
                      {String(idx + 1).padStart(2, '0')} · {item.label}
                    </span>
                    <span className="text-right text-sm leading-relaxed text-foreground/60">
                      {item.value}
                    </span>
                  </div>
                ))}

              {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
                <div className="mt-10">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">Redes</p>
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
                          className="flex items-center gap-1.5 border border-foreground/15 px-3.5 py-1.5 text-xs text-foreground/50 transition-colors hover:border-foreground/60 hover:text-foreground"
                        >
                          <Globe size={10} /> {s.label}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bio + statement + reconocimientos */}
            <div className="space-y-14">
              {artist.bio && (
                <div>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                    Trayectoria
                  </p>
                  <p className="text-lg leading-[1.9] text-foreground/60">
                    <span className="float-left mr-3 mt-1 font-heading text-7xl font-light leading-[0.8] text-foreground/25">
                      {artist.bio.charAt(0)}
                    </span>
                    {artist.bio.slice(1)}
                  </p>
                </div>
              )}

              {artist.statement && (
                <div className="border border-foreground/15 p-8 lg:p-12">
                  <p className="mb-5 text-[10px] uppercase tracking-[0.45em] text-foreground/30">
                    Declaración artística
                  </p>
                  <p className="font-heading text-2xl font-light italic leading-relaxed text-foreground/60 lg:text-3xl">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}

              <div className="grid gap-12 md:grid-cols-3">
                {artist.influences && artist.influences.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                      Influencias
                    </p>
                    <ul className="space-y-2.5">
                      {artist.influences.map((inf) => (
                        <li key={inf} className="text-sm text-foreground/55">— {inf}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.education && artist.education.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                      Formación
                    </p>
                    <ul className="space-y-2.5">
                      {artist.education.map((ed) => (
                        <li key={ed} className="text-sm text-foreground/55">— {ed}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                      Premios
                    </p>
                    <ul className="space-y-2.5">
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

      {/* ─── LA COLECCIÓN — obras enmarcadas ──────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-24 lg:py-36">
          <div className="mx-auto max-w-[1700px] px-8 lg:px-16">
            <div className="mb-16 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">
                  03 / Portfolio
                </p>
                <h2 className="mt-4 font-heading font-light leading-none" style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>
                  La Colección
                </h2>
              </div>
              <p className="hidden select-none font-heading text-[120px] font-light leading-none text-foreground/[0.06] lg:block">
                {String(artworks.length).padStart(2, '0')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <button
                    onClick={() => openModal(artwork)}
                    className="block w-full border border-foreground/15 p-3 transition-all duration-500 group-hover:border-foreground/45 lg:p-4"
                    data-cursor="view"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      {artwork.image_url ? (
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="img-shimmer h-full w-full" />
                      )}
                      {/* Number ghost */}
                      <span className="absolute left-3 top-3 select-none font-heading text-4xl font-light leading-none text-white/0 transition-colors duration-500 group-hover:text-white/80">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                  <div className="mt-5 border-t border-foreground/15 pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-medium leading-tight">{artwork.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-widest text-foreground/35">
                          {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      {artwork.sold ? (
                        <span className="shrink-0 text-[10px] uppercase tracking-widest text-foreground/25">
                          Vendida
                        </span>
                      ) : artwork.price ? (
                        <span className="shrink-0 text-sm text-foreground/55">
                          €{artwork.price.toLocaleString('es-ES')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS ────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-border py-24 lg:py-36">
          <div className="mx-auto max-w-[1700px] px-8 lg:px-16">
            <div className="mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/35">04 / Servicios</p>
              <h2 className="mt-4 font-heading font-light leading-none" style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>
                Encargos &amp; colaboraciones
              </h2>
            </div>

            <div className="divide-y divide-foreground/15 border-t border-foreground/15">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group grid items-center gap-6 py-8 lg:grid-cols-[80px_1fr_auto]"
                >
                  <span className="select-none font-heading text-4xl font-light text-foreground/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                    {service.description && (
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground/45">
                        {service.description}
                      </p>
                    )}
                  </div>
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="inline-flex items-center gap-2 justify-self-start border border-foreground/20 px-5 py-2.5 text-xs uppercase tracking-widest text-foreground/50 transition-all hover:border-foreground hover:bg-foreground hover:text-background lg:justify-self-end"
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

      {/* ─── CONTACTO — monograma ─────────────────────────── */}
      <section className="border-t border-border py-28 lg:py-40">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-foreground/25">
            <span className="font-heading text-3xl font-light text-foreground/60">
              {initials(artist.name)}
            </span>
          </div>
          <Ornament />
          <h2
            className="mt-12 font-heading font-light leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 8vw, 104px)' }}
          >
            Hablemos.
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-loose text-foreground/45">
            Para adquisición de obras, comisariado de exposiciones o proyectos de colaboración.
          </p>

          <div className="mx-auto mt-12 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="inline-flex items-center justify-center gap-3 border border-foreground px-7 py-4 text-sm uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
              >
                <Mail size={14} /> {artist.email}
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="inline-flex items-center justify-center gap-3 border border-foreground/25 px-7 py-4 text-sm uppercase tracking-widest transition-all hover:border-foreground"
              >
                <Phone size={14} /> {artist.phone}
              </a>
            )}
            {artist.whatsapp && (
              <a
                href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-foreground/25 px-7 py-4 text-sm uppercase tracking-widest transition-all hover:border-foreground"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
          </div>

          {(artist.city || artist.country) && (
            <p className="mt-10 text-sm text-foreground/30">
              {[artist.city, artist.country].filter(Boolean).join(', ')}
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
