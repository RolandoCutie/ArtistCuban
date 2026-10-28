'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import ArtworkModal from './ArtworkModal'
import type { LayoutProps } from './types'

function LedgerRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 border-b border-border py-3 text-sm">
      <span className="uppercase tracking-[0.2em] text-foreground/42">{label}</span>
      <span className="text-foreground/72">{value}</span>
    </div>
  )
}

export default function LayoutLedger({
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

  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-10 lg:px-12">
      <header className="border-y-2 border-foreground py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-foreground/50">Archive Ledger</p>
            <h1 className="mt-4 font-heading font-light leading-[0.9]" style={{ fontSize: 'clamp(50px, 7vw, 116px)' }}>
              {artist.name}
            </h1>
            {artist.alias && <p className="mt-2 text-sm uppercase tracking-[0.24em] text-foreground/45">{artist.alias}</p>}
          </div>
          <div className="space-y-1 text-xs uppercase tracking-[0.2em] text-foreground/55 lg:text-right">
            {artist.specialty && <p>{artist.specialty}</p>}
            {location && (
              <p className="flex items-center gap-2 lg:justify-end">
                <MapPin size={12} /> {location}
              </p>
            )}
            {artist.exhibitions_count != null && <p>{artist.exhibitions_count} exposiciones</p>}
          </div>
        </div>
      </header>

      <section className="mt-10 grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <div className="border border-border p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Registro maestro</p>
            <div className="mt-4">
              <LedgerRow label="Nacimiento" value={artist.birth_date} />
              <LedgerRow label="Estilo" value={artist.style} />
              <LedgerRow label="Idiomas" value={artist.languages?.join(', ')} />
              <LedgerRow label="Categorías" value={artist.categories?.join(' · ')} />
              <LedgerRow label="Técnicas" value={artist.techniques?.join(' · ')} />
            </div>
          </div>

          {(artist.bio || artist.statement || artist.inspiring_quote) && (
            <div className="border border-border p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Bitácora</p>
              {artist.bio && <p className="mt-4 text-sm leading-loose text-foreground/74">{artist.bio}</p>}
              {artist.statement && (
                <p className="mt-5 font-heading text-2xl font-light italic leading-relaxed text-foreground/60">
                  &ldquo;{artist.statement}&rdquo;
                </p>
              )}
              {artist.inspiring_quote && (
                <blockquote className="mt-5 border-l-2 border-foreground/35 pl-4 font-heading text-xl font-light text-foreground/60">
                  &ldquo;{artist.inspiring_quote}&rdquo;
                </blockquote>
              )}
            </div>
          )}

          {services.length > 0 && (
            <div className="border border-border p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Servicios</p>
              <div className="mt-4 divide-y divide-border border-y border-border">
                {services.map((service) => (
                  <div key={service._id} className="py-4">
                    <p className="font-heading text-2xl font-light">{service.title}</p>
                    {service.description && <p className="mt-1 text-sm leading-relaxed text-foreground/60">{service.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {artworks.length > 0 && (
            <section className="border border-border p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Inventario de obra</p>
                <p className="text-xs text-foreground/45">{artworks.length} entradas</p>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {artworks.map((artwork, index) => (
                  <motion.button
                    key={artwork._id}
                    onClick={() => openModal(artwork)}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                    className="grid w-full gap-4 py-4 text-left transition-colors hover:bg-muted/45 md:grid-cols-[70px_1fr_190px_auto]"
                    data-cursor="view"
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/42">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-heading text-2xl font-light">{artwork.title}</p>
                      <p className="mt-1 text-sm text-foreground/58">{[artwork.technique, artwork.material].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="text-sm text-foreground/56">{[artwork.year?.toString(), artwork.dimensions].filter(Boolean).join(' · ')}</p>
                    <div className="flex items-center justify-end gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">
                        {artwork.sold ? 'Vendida' : artwork.price ? `€${artwork.price.toLocaleString('es-ES')}` : 'Disponible'}
                      </p>
                      <ArrowUpRight size={14} className="text-foreground/42" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {exhibitions.length > 0 && (
            <section className="border border-border p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Historial expositivo</p>
              <div className="mt-4 divide-y divide-border border-y border-border">
                {exhibitions.map((item) => (
                  <div key={item._id} className="grid gap-3 py-4 md:grid-cols-[1fr_220px]">
                    <div>
                      <p className="font-heading text-2xl font-light">{item.title}</p>
                      <p className="mt-1 text-sm text-foreground/58">{[item.venue, item.location].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className="text-sm text-foreground/56 md:text-right">
                      <p>{item.date}</p>
                      <p className="uppercase tracking-[0.2em] text-foreground/42">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="border border-border p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">Mesa de contacto</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="inline-flex items-center gap-2 border border-foreground px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
                >
                  <Mail size={14} /> Email
                </a>
              )}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <Phone size={14} /> Teléfono
                </a>
              )}
              {artist.social_links?.website && (
                <a
                  href={artist.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
                >
                  <Globe size={14} /> Sitio web
                </a>
              )}
            </div>
          </section>
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
    </div>
  )
}
