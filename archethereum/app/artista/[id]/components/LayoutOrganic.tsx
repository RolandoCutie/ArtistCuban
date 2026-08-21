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

export default function LayoutOrganic({
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
      {/* ─── HERO CENTRADO CON BLOBS FLOTANTES ───────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
        {/* Animated blob backgrounds */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -120, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -right-32 bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -60, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30 blur-3xl"
          />
        </div>

        {/* Blurred cover bg mejorado */}
        {artist.cover_url && (
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 -z-5"
          >
            <img
              src={artist.cover_url}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: 'blur(80px) saturate(1.3)' }}
            />
          </motion.div>
        )}

        {/* Portrait circle con morphing effect */}
        {artist.photo_url ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.05,
              rotate: 5,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              transition: { duration: 0.3 }
            }}
            className="mb-8 h-48 w-48 overflow-hidden rounded-full ring-4 ring-border shadow-2xl shadow-foreground/20 lg:h-64 lg:w-64 relative"
          >
            <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ) : (
          <motion.div
            animate={{
              borderRadius: ['50%', '45%', '50%'],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="mb-8 h-48 w-48 bg-muted shadow-xl"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {artist.specialty && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-3 text-xs uppercase tracking-[0.4em] text-foreground/40"
            >
              {artist.specialty}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-heading font-light leading-tight"
            style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}
          >
            {artist.name}
          </motion.h1>
          {artist.alias && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-3 font-heading text-xl italic text-foreground/40"
            >
              &ldquo;{artist.alias}&rdquo;
            </motion.p>
          )}

          {(artist.city || artist.country) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 flex items-center justify-center gap-1.5 text-sm text-foreground/45"
            >
              <MapPin size={13} />
              {[artist.city, artist.country].filter(Boolean).join(', ')}
            </motion.p>
          )}

          {/* Category color chips con animaciones líquidas */}
          {artist.categories && artist.categories.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {artist.categories.map((cat, i) => (
                <motion.span
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    y: -4,
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full px-4 py-1.5 text-sm font-medium shadow-lg cursor-pointer"
                  style={{
                    background: `hsl(${(i * 37 + 15) % 360} 60% 85%)`,
                    color: `hsl(${(i * 37 + 15) % 360} 50% 30%)`,
                  }}
                >
                  {cat}
                </motion.span>
              ))}
            </div>
          )}

          {/* Social links circles con bounce */}
          {artist.social_links && Object.values(artist.social_links).some(Boolean) && (
            <div className="mt-6 flex justify-center gap-2">
              {[
                { href: artist.social_links.website, label: 'Web' },
                { href: artist.social_links.instagram, label: 'Instagram' },
                { href: artist.social_links.linkedin, label: 'LinkedIn' },
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
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{
                      scale: 1.2,
                      y: -5,
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground/50 shadow-md transition-all hover:bg-foreground hover:text-background"
                  >
                    <Globe size={15} />
                  </motion.a>
                ))}
            </div>
          )}

          {/* CTA con floating animation */}
          {artist.email && (
            <motion.a
              href={`mailto:${artist.email}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-10 py-4 text-sm font-medium text-background shadow-2xl shadow-foreground/30 transition-all hover:bg-foreground/90"
            >
              <Mail size={15} /> Contactar artista
            </motion.a>
          )}
        </motion.div>
      </section>

      {/* ─── QUOTE CON SOFT MORPHING ─────────────────────── */}
      {artist.inspiring_quote && (
        <section className="py-20 lg:py-32 relative overflow-hidden">
          {/* Floating orbs background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-pink-200/40 to-purple-200/40 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-200/40 blur-3xl"
          />

          <div className="mx-auto max-w-3xl px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl bg-muted/80 backdrop-blur-xl p-10 text-center lg:p-16 shadow-2xl shadow-foreground/5 border border-border/50"
            >
              <motion.blockquote
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-heading text-2xl font-light italic leading-relaxed text-foreground/70 md:text-3xl"
              >
                &ldquo;{artist.inspiring_quote}&rdquo;
              </motion.blockquote>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6 text-[10px] uppercase tracking-[0.4em] text-foreground/35"
              >
                — {artist.name}
              </motion.p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── BIOGRAFÍA — cards redondeados ────────────────── */}
      <section className="border-t border-border py-20 lg:py-36">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">
              Sobre el artista
            </p>
            <h2 className="mt-2 font-heading text-5xl font-light">Biografía</h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* Info cards */}
            <div className="space-y-3">
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Especialidad', value: artist.specialty },
                { label: 'Estilo', value: artist.style },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                {
                  label: 'Exposiciones',
                  value:
                    artist.exhibitions_count != null ? String(artist.exhibitions_count) : undefined,
                },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl bg-muted px-5 py-4"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-foreground/35">
                      {item.label}
                    </span>
                    <span className="text-right text-sm text-foreground/65">{item.value}</span>
                  </div>
                ))}

              {/* Techniques */}
              {artist.techniques && artist.techniques.length > 0 && (
                <div className="rounded-2xl bg-muted px-5 py-4">
                  <p className="mb-3 text-[10px] uppercase tracking-widest text-foreground/35">
                    Técnicas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.techniques.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-background px-3 py-1 text-xs text-foreground/55 shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bio / statement / awards */}
            <div className="space-y-4">
              {artist.bio && (
                <div className="rounded-3xl bg-muted p-8 lg:p-10">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Biografía
                  </p>
                  <p className="text-base leading-loose text-foreground/65">{artist.bio}</p>
                </div>
              )}

              {artist.statement && (
                <div className="rounded-3xl border-2 border-border p-8">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Declaración artística
                  </p>
                  <p className="font-heading text-xl italic leading-relaxed text-foreground/55">
                    &ldquo;{artist.statement}&rdquo;
                  </p>
                </div>
              )}

              {artist.influences && artist.influences.length > 0 && (
                <div className="rounded-3xl bg-muted p-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Influencias
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {artist.influences.map((inf) => (
                      <span
                        key={inf}
                        className="rounded-full bg-background px-4 py-1.5 text-sm text-foreground/55 shadow-sm"
                      >
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {artist.education && artist.education.length > 0 && (
                <div className="rounded-3xl bg-muted p-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Formación
                  </p>
                  <ul className="space-y-2">
                    {artist.education.map((ed) => (
                      <li key={ed} className="flex items-start gap-2 text-sm text-foreground/55">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/25" />
                        {ed}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {artist.awards && artist.awards.length > 0 && (
                <div className="rounded-3xl bg-muted p-8">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
                    Premios
                  </p>
                  <ul className="space-y-2">
                    {artist.awards.map((aw) => (
                      <li key={aw} className="flex items-start gap-2 text-sm text-foreground/55">
                        <Award size={13} className="mt-0.5 shrink-0 text-foreground/25" /> {aw}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OBRAS — masonry redondeado ───────────────────── */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-20 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Portafolio</p>
              <h2 className="mt-2 font-heading text-5xl font-light">Obras</h2>
            </div>

            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork._id}
                  className="mb-4 break-inside-avoid"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                >
                  <button
                    onClick={() => openModal(artwork)}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-foreground/10"
                  >
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full rounded-2xl transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer aspect-square rounded-2xl" />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/65 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="font-heading text-lg leading-tight text-white">{artwork.title}</p>
                      {artwork.price && !artwork.sold && (
                        <p className="mt-1 text-sm font-medium text-white">
                          €{artwork.price.toLocaleString('es-ES')}
                        </p>
                      )}
                    </div>
                  </button>
                  <div className="mt-2 px-1">
                    <p className="text-sm text-foreground/55">{artwork.title}</p>
                    {artwork.technique && (
                      <p className="text-xs text-foreground/35">{artwork.technique}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICIOS — cards redondeados cálidos ────────── */}
      {services.length > 0 && (
        <section className="border-t border-border py-20 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Servicios</p>
              <h2 className="mt-2 font-heading text-5xl font-light">
                Trabajar con {artist.name}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-3xl border-2 border-border bg-background p-8 transition-all duration-300 hover:border-foreground/25 hover:shadow-xl hover:shadow-foreground/10"
                >
                  <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                  {service.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/45">
                      {service.description}
                    </p>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta: ${service.title}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-xs text-foreground/45 transition-all hover:border-foreground hover:text-foreground"
                    >
                      Solicitar información <ArrowUpRight size={12} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACTO — cálido centrado ───────────────────── */}
      <section className="border-t border-border py-20 lg:py-36">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30">Conectar</p>
          <h2 className="mt-4 font-heading text-5xl font-light">
            ¿Interesado en<br />
            <span className="italic">el trabajo</span>?
          </h2>
          <p className="mt-6 leading-loose text-foreground/45">
            Para adquirir obras, organizar exposiciones o explorar colaboraciones creativas.
          </p>

          <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3">
            {artist.email && (
              <a
                href={`mailto:${artist.email}`}
                className="flex items-center justify-between rounded-2xl bg-foreground px-6 py-4 text-sm text-background shadow-lg shadow-foreground/20 transition-colors hover:bg-foreground/80"
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
                className="flex items-center justify-between rounded-2xl bg-muted px-6 py-4 text-sm transition-all hover:bg-foreground hover:text-background"
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
                className="flex items-center justify-between rounded-2xl bg-muted px-6 py-4 text-sm transition-all hover:bg-foreground hover:text-background"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={14} /> WhatsApp
                </span>
                <ArrowUpRight size={14} />
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
    </>
  )
}
