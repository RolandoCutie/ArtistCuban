'use client'

import { motion } from 'framer-motion'
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
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

export default function LayoutEmerald({
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
      {/* ─── HERO — inmersión esmeralda ───────────────────── */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Cover con duotono esmeralda */}
        <div className="absolute inset-0">
          {artist.cover_url ? (
            <img
              src={artist.cover_url}
              alt={artist.name}
              className="h-full w-full object-cover"
              style={{ filter: 'saturate(0.55) contrast(1.15) brightness(0.6)' }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-950 via-[#123528] to-[#0b2017]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07130e]/95 via-[#0b2017]/60 to-[#123528]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-transparent to-transparent" />
        </div>

        {/* Texto vertical */}
        <p
          className="absolute left-8 top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.6em] text-emerald-100/25 lg:block"
          style={{ writingMode: 'vertical-rl' }}
        >
          Colección {artist.specialty || 'Arte'} · Archethereum
        </p>

        {/* Retrato flotante con anillos */}
        {artist.photo_url && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-10 top-1/2 hidden -translate-y-1/2 md:block lg:right-24"
          >
            <div className="relative h-72 w-56 lg:h-96 lg:w-72">
              <div className="absolute -inset-3 rounded-full border border-emerald-300/30" />
              <div className="absolute -inset-6 rounded-full border border-emerald-300/10" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-emerald-300/25">
                <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Nombre */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-[1700px] px-8 pb-24 lg:px-24 lg:pb-28">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-emerald-200/50"
            >
              <span className="h-px w-10 bg-emerald-200/40" />
              {artist.specialty || 'Artista'}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl font-heading font-light leading-[0.9] text-white"
              style={{ fontSize: 'clamp(58px, 9.5vw, 150px)' }}
            >
              {artist.name}
            </motion.h1>
            {artist.alias && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-4 font-heading text-xl italic text-emerald-100/40"
              >
                &ldquo;{artist.alias}&rdquo;
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-emerald-100/60"
            >
              {(artist.city || artist.country) && (
                <p className="flex items-center gap-2">
                  <MapPin size={13} /> {[artist.city, artist.country].filter(Boolean).join(', ')}
                </p>
              )}
              {artist.exhibitions_count != null && <p>{artist.exhibitions_count} exposiciones</p>}
              {artist.birth_date && <p>N. {artist.birth_date}</p>}
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        >
          <ChevronDown size={22} className="text-emerald-100/30" />
        </motion.div>
      </section>

      {/* ─── MANIFIESTO — panel esmeralda ─────────────────── */}
      {artist.inspiring_quote && (
        <section className="bg-gradient-to-br from-[#0b2017] to-[#123528] py-24 lg:py-36">
          <div className="mx-auto max-w-5xl px-8 text-center lg:px-16">
            <p className="mb-8 text-[10px] uppercase tracking-[0.6em] text-emerald-200/35">Manifiesto</p>
            <blockquote
              className="font-heading font-light italic leading-tight text-emerald-50/85"
              style={{ fontSize: 'clamp(28px, 4.5vw, 58px)' }}
            >
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-emerald-200/30" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-200/40">— {artist.name}</p>
              <span className="h-px w-10 bg-emerald-200/30" />
            </div>
          </div>
        </section>
      )}

      {/* ─── DOSSIER — líneas esmeralda ───────────────────── */}
      <section className="py-24 lg:py-36">
        <div className="mx-auto max-w-[1700px] px-8 lg:px-24">
          <div className="mb-16 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-700">02 / Dossier</p>
              <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Trayectoria</h2>
            </div>
            {artist.is_featured && (
              <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Artista de colección
              </p>
            )}
          </div>

          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Ficha */}
            <div>
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Estilo', value: artist.style },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                { label: 'Técnicas', value: artist.techniques?.join(' · ') },
              ]
                .filter((i) => i.value)
                .map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between gap-8 border-b border-emerald-900/15 py-4 first:border-t"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-800/70">
                      {String(idx + 1).padStart(2, '0')} · {item.label}
                    </span>
                    <span className="text-right text-sm text-foreground/60">{item.value}</span>
                  </div>
                ))}
            </div>

            {/* Bio + reconocimientos */}
            <div className="space-y-12">
              {artist.bio && (
                <div>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-emerald-700">Biografía</p>
                  <p className="text-lg leading-[1.9] text-foreground/60">{artist.bio}</p>
                </div>
              )}
              {artist.statement && (
                <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-10">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-emerald-800">Declaración</p>
                  <p className="font-heading text-2xl font-light italic leading-relaxed text-emerald-950">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}
              <div className="grid gap-10 md:grid-cols-3">
                {artist.influences && artist.influences.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-emerald-700">Influencias</p>
                    <ul className="space-y-2">
                      {artist.influences.map((inf) => (
                        <li key={inf} className="text-sm text-foreground/55">— {inf}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.education && artist.education.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-emerald-700">Formación</p>
                    <ul className="space-y-2">
                      {artist.education.map((ed) => (
                        <li key={ed} className="text-sm text-foreground/55">— {ed}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-emerald-700">Premios</p>
                    <ul className="space-y-2">
                      {artist.awards.map((aw) => (
                        <li key={aw} className="flex items-start gap-2 text-sm text-foreground/55">
                          <Award size={12} className="mt-0.5 shrink-0 text-emerald-600" /> {aw}
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

      {/* ─── OBRAS — obra principal + mosaico ─────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-emerald-900/10 py-24 lg:py-36">
          <div className="mx-auto max-w-[1700px] px-8 lg:px-24">
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-700">03 / Jardín de obras</p>
                <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">Portafolio</h2>
              </div>
              <p className="hidden select-none font-heading text-[96px] font-light leading-none text-emerald-900/10 lg:block">
                {artworks.length}
              </p>
            </div>

            {/* Obra principal */}
            <button
              onClick={() => openModal(artworks[0])}
              className="group relative block w-full overflow-hidden rounded-3xl"
              style={{ height: 'min(70vh, 640px)' }}
              data-cursor="view"
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
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#07130e]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8 lg:p-12">
                <div>
                  <p className="font-heading text-white" style={{ fontSize: 'clamp(28px, 4.5vw, 56px)' }}>
                    {artworks[0].title}
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/50">
                    {[artworks[0].technique, artworks[0].year].filter(Boolean).join(' · ')}
                  </p>
                </div>
                {artworks[0].price && !artworks[0].sold && (
                  <p className="font-heading text-3xl text-emerald-100/80">
                    €{artworks[0].price.toLocaleString('es-ES')}
                  </p>
                )}
              </div>
            </button>

            {/* Resto */}
            {artworks.length > 1 && (
              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {artworks.slice(1).map((artwork, i) => (
                  <motion.button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                    className="group relative block overflow-hidden rounded-2xl bg-muted"
                    style={{ aspectRatio: '3/4' }}
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
                    <div className="absolute inset-0 rounded-2xl bg-emerald-950/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex flex-col justify-end rounded-2xl p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-heading text-lg leading-tight text-white">{artwork.title}</p>
                      <p className="mt-1 text-xs text-emerald-100/60">
                        {artwork.year}
                        {artwork.price && !artwork.sold ? ` · €${artwork.price.toLocaleString('es-ES')}` : ''}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — números esmeralda ────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-emerald-900/10 py-24 lg:py-36">
          <div className="mx-auto max-w-[1700px] px-8 lg:px-24">
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-700">04 / Servicios</p>
              <h2 className="mt-4 font-heading text-5xl font-light md:text-7xl">
                Trabajar con {artist.name}
              </h2>
            </div>

            <div className="divide-y divide-emerald-900/10 border-y border-emerald-900/10">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex flex-col gap-4 py-7 transition-colors hover:bg-emerald-50/50 lg:flex-row lg:items-center lg:justify-between lg:px-4"
                >
                  <div className="flex flex-1 items-start gap-6">
                    <span className="select-none font-heading text-4xl font-light text-emerald-700">
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
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-800/30 px-5 py-2.5 text-xs uppercase tracking-widest text-emerald-800 transition-colors hover:bg-emerald-800 hover:text-white"
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

      {/* ─── CONTACTO — cierre profundo ───────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2017] via-[#0e2a1f] to-[#123528] py-28 lg:py-40">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.6em] text-emerald-200/40">05 / Contacto</p>
          <h2
            className="mt-6 font-heading font-light leading-[0.95] text-emerald-50"
            style={{ fontSize: 'clamp(48px, 8vw, 108px)' }}
          >
            Conversemos.
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-loose text-emerald-100/45">
            Para adquirir obras, exposiciones o proyectos que enriquezcan tu colección.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="flex items-center justify-center gap-3 rounded-full border border-emerald-200/30 px-8 py-4 text-sm text-emerald-50 transition-all hover:bg-emerald-300 hover:text-emerald-950"
              >
                <Mail size={15} /> {artist.email}
              </a>
            )}
            {artist.phone && (
              <a
                href={`tel:${artist.phone}`}
                className="flex items-center justify-center gap-3 rounded-full border border-emerald-200/20 px-8 py-4 text-sm text-emerald-100/70 transition-colors hover:border-emerald-200/50"
              >
                <Phone size={15} /> {artist.phone}
              </a>
            )}
            {artist.whatsapp && (
              <a
                href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-full border border-emerald-200/20 px-8 py-4 text-sm text-emerald-100/70 transition-colors hover:border-emerald-200/50"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
          </div>

          {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
            <div className="mt-10 flex justify-center gap-4">
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
                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-100/40 transition-colors hover:text-emerald-100"
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
