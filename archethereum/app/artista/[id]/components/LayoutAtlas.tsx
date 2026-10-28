'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-3 text-sm">
      <span className="uppercase tracking-[0.2em] text-foreground/45">{label}</span>
      <span className="text-right text-foreground/75">{value}</span>
    </div>
  )
}

export default function LayoutAtlas({
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
  const location = [artist.city, artist.country].filter(Boolean).join(', ')
  const socialLinks = [
    { label: 'Web', href: artist.social_links?.website },
    { label: 'Instagram', href: artist.social_links?.instagram },
    { label: 'Behance', href: artist.social_links?.behance },
    { label: 'LinkedIn', href: artist.social_links?.linkedin },
  ].filter((item) => item.href)

  return (
    <div className="mx-auto max-w-[1720px] px-6 pb-24 pt-12 lg:px-12">
      <header className="border-b border-border/70 pb-10">
        <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/45">Atlas Curatorial</p>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading font-light leading-[0.9]" style={{ fontSize: 'clamp(52px, 8vw, 130px)' }}>
              {artist.name}
            </h1>
            {artist.alias && <p className="mt-3 font-heading text-2xl italic text-foreground/45">&ldquo;{artist.alias}&rdquo;</p>}
          </div>
          <div className="space-y-2 text-sm text-foreground/65">
            {location && (
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {location}
              </p>
            )}
            {artist.specialty && <p>{artist.specialty}</p>}
            {artist.exhibitions_count != null && <p>{artist.exhibitions_count} exposiciones registradas</p>}
          </div>
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[340px_1fr]">
        <aside className="self-start lg:sticky lg:top-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[1.5rem] border border-border bg-card p-5"
          >
            {(artist.photo_url || artist.cover_url) && (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted">
                <img
                  src={artist.photo_url || artist.cover_url}
                  alt={artist.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/45">Ficha rápida</p>
              <div className="mt-3">
                <MetaRow label="Nacimiento" value={artist.birth_date} />
                <MetaRow label="Estilo" value={artist.style} />
                <MetaRow label="Idiomas" value={artist.languages?.join(', ')} />
                <MetaRow label="Técnicas" value={artist.techniques?.slice(0, 4).join(' · ')} />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={14} /> Email
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={14} /> Teléfono
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              {artist.whatsapp && (
                <a
                  href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={14} /> WhatsApp
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </aside>

        <div className="space-y-20">
          {(artist.bio || artist.statement || artist.inspiring_quote) && (
            <section className="space-y-6 rounded-[1.5rem] border border-border/70 bg-card p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Narrativa</p>
              {artist.bio && <p className="max-w-4xl text-base leading-loose text-foreground/75">{artist.bio}</p>}
              {artist.statement && (
                <p className="max-w-4xl font-heading text-3xl font-light italic leading-relaxed text-foreground/62">
                  &ldquo;{artist.statement}&rdquo;
                </p>
              )}
              {artist.inspiring_quote && (
                <blockquote className="border-l-2 border-foreground/35 pl-5 font-heading text-2xl font-light leading-snug text-foreground/58">
                  &ldquo;{artist.inspiring_quote}&rdquo;
                </blockquote>
              )}
            </section>
          )}

          {artworks.length > 0 && (
            <section>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Colección principal</p>
                  <h2 className="mt-2 font-heading text-4xl font-light">Obras</h2>
                </div>
                <p className="text-sm text-foreground/45">{artworks.length} piezas</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {artworks.map((artwork, index) => (
                  <motion.button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-foreground/55"
                    data-cursor="view"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      {artwork.image_url ? (
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="img-shimmer h-full w-full" />
                      )}
                    </div>
                    <div className="space-y-2 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-2xl font-light leading-tight">{artwork.title}</h3>
                        <ArrowUpRight size={15} className="mt-1 shrink-0 text-foreground/45" />
                      </div>
                      <p className="text-sm text-foreground/52">{[artwork.technique, artwork.year].filter(Boolean).join(' · ')}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                        {artwork.sold ? 'Vendida' : artwork.price ? `€${artwork.price.toLocaleString('es-ES')}` : 'Disponible'}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {(exhibitions.length > 0 || services.length > 0) && (
            <section className="grid gap-8 xl:grid-cols-2">
              {exhibitions.length > 0 && (
                <div className="rounded-[1.5rem] border border-border bg-card p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground/45">Circuito de exhibiciones</p>
                  <div className="mt-5 space-y-3">
                    {exhibitions.map((item) => (
                      <div key={item._id} className="rounded-xl border border-border/70 bg-background/60 p-4">
                        <p className="font-heading text-2xl font-light">{item.title}</p>
                        <p className="mt-1 text-sm text-foreground/55">{[item.venue, item.location].filter(Boolean).join(' · ')}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/45">
                          {[item.date, item.type].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div className="rounded-[1.5rem] border border-border bg-card p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground/45">Servicios para clientes</p>
                  <div className="mt-5 space-y-3">
                    {services.map((service) => (
                      <div key={service._id} className="rounded-xl border border-border/70 bg-background/60 p-4">
                        <p className="font-heading text-2xl font-light">{service.title}</p>
                        {service.description && (
                          <p className="mt-2 text-sm leading-relaxed text-foreground/58">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="rounded-[1.5rem] border border-border/75 bg-card px-8 py-10">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/45">Contacto directo</p>
            <h2 className="mt-3 font-heading text-4xl font-light">Conversemos sobre una colaboración</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
                >
                  <Mail size={15} /> Enviar email
                </a>
              )}
              {artist.social_links?.website && (
                <a
                  href={artist.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <Globe size={15} /> Ver sitio oficial
                </a>
              )}
            </div>
          </section>
        </div>
      </div>

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
