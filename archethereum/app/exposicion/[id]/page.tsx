'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    ChevronLeft, ChevronRight,
    Mail,
    Moon,
    Share2,
    ShoppingBag,
    Sun,
    Volume2,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Artwork {
  _id: string
  title: string
  series?: string
  description?: string
  history?: string
  technique?: string
  material?: string
  year?: number
  price?: number
  available?: boolean
  sold?: boolean
  edition?: string
  dimensions?: string
  weight?: string
  certificate?: string
  image_url?: string
}

interface Exhibition {
  _id: string
  title: string
  curator?: string
  artist_name?: string
  artist_id?: string
  date?: string
  end_date?: string
  description?: string
  cover_url?: string
  status?: string
  schedule?: string
  venue?: string
  artwork_ids?: string[]
}

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [galleryDark, setGalleryDark] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const exRes = await fetch(`/api/exhibitions/${id}`)
      const ex: Exhibition = await exRes.json()
      setExhibition(ex)

      if (ex.artist_id) {
        const awRes = await fetch(`/api/artworks?artist_id=${ex.artist_id}`)
        const allArtworks: Artwork[] = await awRes.json()
        const filtered = ex.artwork_ids?.length
          ? allArtworks.filter((a) => ex.artwork_ids!.includes(a._id))
          : allArtworks
        setArtworks(filtered)
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const openModal = (artwork: Artwork) => {
    const idx = artworks.findIndex((a) => a._id === artwork._id)
    setActiveIndex(idx)
    setActiveArtwork(artwork)
  }

  const navigateArtwork = useCallback((dir: 1 | -1) => {
    const newIdx = (activeIndex + dir + artworks.length) % artworks.length
    setActiveIndex(newIdx)
    setActiveArtwork(artworks[newIdx])
  }, [activeIndex, artworks])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeArtwork) return
      if (e.key === 'ArrowRight') navigateArtwork(1)
      if (e.key === 'ArrowLeft') navigateArtwork(-1)
      if (e.key === 'Escape') setActiveArtwork(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeArtwork, navigateArtwork])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="img-shimmer h-16 w-16 rounded-full" />
      </div>
    )
  }

  if (!exhibition || (exhibition as { error?: string }).error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-foreground/50">Exposición no encontrada</p>
        <Link href="/galeria-virtual" className="text-sm underline">← Galería Virtual</Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {exhibition.cover_url ? (
            <img src={exhibition.cover_url} alt={exhibition.title} className="h-full w-full object-cover" />
          ) : (
            <div className="img-shimmer h-full w-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />

        <Link
          href="/galeria-virtual"
          className="absolute left-6 top-24 z-10 text-sm text-white/60 hover:text-white transition-colors lg:left-12"
        >
          ← Galería Virtual
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 p-6 lg:p-12"
        >
          {exhibition.status === 'active' && (
            <div className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-white">En vivo</span>
            </div>
          )}

          {exhibition.date && (
            <p className="mb-2 text-xs uppercase tracking-widest text-white/50">
              {new Date(exhibition.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              {exhibition.end_date && ` — ${new Date(exhibition.end_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>
          )}

          <h1 className="font-heading text-5xl font-light leading-none text-white md:text-7xl lg:text-8xl">
            {exhibition.title}
          </h1>

          {(exhibition.curator || exhibition.artist_name) && (
            <p className="mt-3 text-sm text-white/60">
              {[exhibition.curator && `Curado por ${exhibition.curator}`, exhibition.artist_name].filter(Boolean).join(' · ')}
            </p>
          )}

          {exhibition.schedule && (
            <p className="mt-1 text-sm text-white/50">{exhibition.schedule}</p>
          )}
        </motion.div>
      </section>

      {/* Descripción */}
      {(exhibition.description || exhibition.venue || exhibition.schedule) && (
        <section className="border-t border-border py-20 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            {exhibition.description && (
              <p className="font-heading text-2xl font-light italic leading-relaxed text-foreground/70 md:text-3xl">
                &ldquo;{exhibition.description}&rdquo;
              </p>
            )}
            {(exhibition.venue || exhibition.schedule) && (
              <div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8">
                {exhibition.venue && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Sede</p>
                    <p className="mt-1 text-sm">{exhibition.venue}</p>
                  </div>
                )}
                {exhibition.schedule && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Horario</p>
                    <p className="mt-1 text-sm">{exhibition.schedule}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Galería inmersiva */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-20 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">Las obras</p>
                <h2 className="font-heading text-4xl font-light md:text-5xl">
                  Recorre la exposición
                </h2>
              </div>
              <button
                onClick={() => setGalleryDark(!galleryDark)}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-foreground transition-colors"
              >
                {galleryDark ? <Sun size={14} /> : <Moon size={14} />}
                {galleryDark ? 'Modo claro' : 'Modo oscuro'}
              </button>
            </div>

            <div
              className={`-mx-6 px-6 py-10 transition-colors duration-500 lg:-mx-12 lg:px-12 ${
                galleryDark ? 'bg-foreground' : 'bg-background'
              }`}
            >
              <div className="flex gap-12 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
                {artworks.map((artwork) => (
                  <div
                    key={artwork._id}
                    className="shrink-0 snap-center"
                    style={{ width: 'min(500px, 80vw)' }}
                  >
                    <button
                      onClick={() => openModal(artwork)}
                      className="group relative block w-full overflow-hidden bg-muted/20"
                      data-cursor="view"
                    >
                      {artwork.image_url ? (
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          style={{ maxHeight: 520 }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="img-shimmer aspect-[3/4]" />
                      )}
                    </button>
                    <div className="mt-4">
                      <p className={`font-heading text-2xl font-light ${galleryDark ? 'text-background' : 'text-foreground'}`}>
                        {artwork.title}
                      </p>
                      {(artwork.technique || artwork.year) && (
                        <p className={`mt-1 text-sm ${galleryDark ? 'text-background/50' : 'text-foreground/50'}`}>
                          {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className={`mt-2 text-xs uppercase tracking-widest ${galleryDark ? 'text-background/30' : 'text-foreground/30'}`}>
                        Click para ampliar
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal */}
      <AnimatePresence>
        {activeArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-6 lg:p-8">
              <div>
                <h3 className="font-heading text-3xl font-light">{activeArtwork.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">
                  Obra {activeIndex + 1} de {artworks.length} · ← → para navegar
                </p>
              </div>
              <button
                onClick={() => setActiveArtwork(null)}
                className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row">
              <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
                <button
                  onClick={() => navigateArtwork(-1)}
                  className="absolute left-4 z-10 h-12 w-12 rounded-full border border-border bg-background/80 flex items-center justify-center hover:border-foreground transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {activeArtwork.image_url && (
                  <motion.img
                    key={activeArtwork._id}
                    src={activeArtwork.image_url}
                    alt={activeArtwork.title}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-h-full max-w-full object-contain shadow-2xl"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  />
                )}

                <button
                  onClick={() => navigateArtwork(1)}
                  className="absolute right-4 z-10 h-12 w-12 rounded-full border border-border bg-background/80 flex items-center justify-center hover:border-foreground transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="shrink-0 overflow-y-auto border-t border-border p-6 lg:w-[420px] lg:border-l lg:border-t-0">
                <div className="space-y-6">
                  {activeArtwork.series && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/40">Serie</p>
                      <p className="mt-1 text-sm">{activeArtwork.series}</p>
                    </div>
                  )}
                  {activeArtwork.description && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/40">Descripción</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">{activeArtwork.description}</p>
                    </div>
                  )}
                  {activeArtwork.history && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/40">Historia</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">{activeArtwork.history}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Técnica', value: activeArtwork.technique },
                      { label: 'Material', value: activeArtwork.material },
                      { label: 'Año', value: activeArtwork.year?.toString() },
                      { label: 'Dimensiones', value: activeArtwork.dimensions },
                      { label: 'Peso', value: activeArtwork.weight },
                      { label: 'Edición', value: activeArtwork.edition },
                    ].filter((i) => i.value).map((item) => (
                      <div key={item.label}>
                        <p className="text-xs uppercase tracking-widest text-foreground/40">{item.label}</p>
                        <p className="mt-1 text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {activeArtwork.certificate && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs uppercase tracking-widest text-foreground/40">Certificado</p>
                      <p className="mt-1 text-sm text-foreground/70">{activeArtwork.certificate}</p>
                    </div>
                  )}

                  {activeArtwork.price && (
                    <div>
                      <p className="font-heading text-2xl">€{activeArtwork.price.toLocaleString('es-ES')}</p>
                      <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                        activeArtwork.sold ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'
                      }`}>
                        {activeArtwork.sold ? 'Vendida' : 'Disponible'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-foreground transition-colors">
                      <Volume2 size={16} /> Audio guía
                    </button>
                    {!activeArtwork.sold && exhibition.artist_id && (
                      <a
                        href={`/artista/${exhibition.artist_id}`}
                        className="flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm text-background hover:bg-foreground/90 transition-colors"
                      >
                        <ShoppingBag size={16} /> Comprar
                      </a>
                    )}
                    <button className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-foreground transition-colors">
                      <Mail size={16} /> Consultar
                    </button>
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
    </>
  )
}
