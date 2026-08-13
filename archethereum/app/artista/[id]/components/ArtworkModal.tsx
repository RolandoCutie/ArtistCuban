'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mail, Share2, ShoppingBag, X } from 'lucide-react'
import type { Artist, Artwork } from './types'

interface ArtworkModalProps {
  artist: Artist
  artworks: Artwork[]
  modalArtwork: Artwork | null
  modalIndex: number
  navigateArtwork: (dir: 1 | -1) => void
  closeModal: () => void
}

export default function ArtworkModal({
  artist,
  artworks,
  modalArtwork,
  modalIndex,
  navigateArtwork,
  closeModal,
}: ArtworkModalProps) {
  return (
    <AnimatePresence>
      {modalArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6 lg:p-8">
            <div>
              <h3 className="font-heading text-3xl font-light leading-tight">{modalArtwork.title}</h3>
              <p className="mt-1 text-sm text-foreground/50">
                {artist.name} · Obra {modalIndex + 1} de {artworks.length} · ← → para navegar
              </p>
            </div>
            <button
              onClick={closeModal}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:border-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row">
            {/* Image */}
            <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
              <button
                onClick={() => navigateArtwork(-1)}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 hover:border-foreground transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {modalArtwork.image_url ? (
                <motion.img
                  key={modalArtwork._id}
                  src={modalArtwork.image_url}
                  alt={modalArtwork.title}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-h-full max-w-full object-contain shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 200px)' }}
                />
              ) : (
                <div className="img-shimmer h-64 w-64 rounded" />
              )}

              <button
                onClick={() => navigateArtwork(1)}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 hover:border-foreground transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Details panel */}
            <div className="shrink-0 overflow-y-auto border-t border-border p-6 lg:w-[420px] lg:border-l lg:border-t-0">
              <div className="space-y-6">
                {modalArtwork.series && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Serie</p>
                    <p className="mt-1 text-sm">{modalArtwork.series}</p>
                  </div>
                )}
                {modalArtwork.description && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Descripción</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">{modalArtwork.description}</p>
                  </div>
                )}
                {modalArtwork.history && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Historia</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">{modalArtwork.history}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Técnica', value: modalArtwork.technique },
                    { label: 'Material', value: modalArtwork.material },
                    { label: 'Año', value: modalArtwork.year?.toString() },
                    { label: 'Dimensiones', value: modalArtwork.dimensions },
                    { label: 'Peso', value: modalArtwork.weight },
                    { label: 'Edición', value: modalArtwork.edition },
                  ]
                    .filter((i) => i.value)
                    .map((item) => (
                      <div key={item.label}>
                        <p className="text-xs uppercase tracking-widest text-foreground/40">{item.label}</p>
                        <p className="mt-1 text-sm">{item.value}</p>
                      </div>
                    ))}
                </div>
                {modalArtwork.certificate && (
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Certificado</p>
                    <p className="mt-1 text-sm text-foreground/70">{modalArtwork.certificate}</p>
                  </div>
                )}
                {modalArtwork.price && (
                  <div>
                    <p className="font-heading text-2xl">€{modalArtwork.price.toLocaleString('es-ES')}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                        modalArtwork.sold
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-green-500/10 text-green-600'
                      }`}
                    >
                      {modalArtwork.sold ? 'Vendida' : 'Disponible'}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  {artist.email && !modalArtwork.sold && (
                    <a
                      href={`mailto:${artist.email}?subject=Compra: ${modalArtwork.title}`}
                      className="flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm text-background hover:bg-foreground/90 transition-colors"
                    >
                      <ShoppingBag size={16} /> Comprar
                    </a>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta sobre: ${modalArtwork.title}`}
                      className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-foreground transition-colors"
                    >
                      <Mail size={16} /> Consultar
                    </a>
                  )}
                  <button className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-foreground transition-colors">
                    <Share2 size={16} /> Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
