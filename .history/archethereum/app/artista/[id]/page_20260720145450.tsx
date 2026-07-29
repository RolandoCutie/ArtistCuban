'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowUpRight, Award,
    ChevronLeft, ChevronRight,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    ShoppingBag,
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

interface Artist {
  _id: string
  name: string
  alias?: string
  specialty?: string
  categories?: string[]
  country?: string
  city?: string
  bio?: string
  statement?: string
  photo_url?: string
  cover_url?: string
  birth_date?: string
  languages?: string[]
  style?: string
  influences?: string[]
  techniques?: string[]
  education?: string[]
  awards?: string[]
  exhibitions_count?: number
  email?: string
  phone?: string
  whatsapp?: string
  is_featured?: boolean
  is_active?: boolean
  template?: string
  inspiring_quote?: string
  social_links?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    behance?: string
    linkedin?: string
    pinterest?: string
    twitter?: string
    website?: string
  }
}

interface Service {
  _id: string
  title: string
  description?: string
  icon_name?: string
}

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalArtwork, setModalArtwork] = useState<Artwork | null>(null)
  const [modalIndex, setModalIndex] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      const aRes = await fetch(`/api/artists/${id}`)
      const artistData = await aRes.json()
      setArtist(artistData)
      if (artistData?._id) {
        const [awRes, svRes] = await Promise.all([
          fetch(`/api/artworks?artist_id=${artistData._id}`),
          fetch(`/api/services?artist_id=${artistData._id}`),
        ])
        setArtworks(await awRes.json())
        setServices(await svRes.json())
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const openModal = (artwork: Artwork) => {
    const idx = artworks.findIndex((a) => a._id === artwork._id)
    setModalIndex(idx)
    setModalArtwork(artwork)
  }

  const navigateArtwork = useCallback((dir: 1 | -1) => {
    const newIdx = (modalIndex + dir + artworks.length) % artworks.length
    setModalIndex(newIdx)
    setModalArtwork(artworks[newIdx])
  }, [modalIndex, artworks])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!modalArtwork) return
      if (e.key === 'ArrowRight') navigateArtwork(1)
      if (e.key === 'ArrowLeft') navigateArtwork(-1)
      if (e.key === 'Escape') setModalArtwork(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalArtwork, navigateArtwork])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="img-shimmer h-16 w-16 rounded-full" />
      </div>
    )
  }

  if (!artist || (artist as { error?: string }).error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-heading text-4xl font-light text-foreground/30">404</p>
        <p className="font-heading text-xl text-foreground/50">Artista no encontrado</p>
        <Link href="/" className="text-sm underline text-foreground/40 hover:text-foreground transition-colors">← Volver al inicio</Link>
      </div>
    )
  }

  if (artist.is_active === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-foreground/30">Archethereum</p>
          <h1 className="font-heading text-4xl font-light leading-tight text-foreground/60 md:text-5xl">
            Este artista no se encuentra<br />
            <span className="italic">disponible en este momento</span>
          </h1>
          <p className="mt-6 text-sm text-foreground/40">
            El perfil de este artista no está activo actualmente.<br />
            Por favor, vuelve más tarde o explora otros artistas.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest text-foreground/40 hover:border-foreground/60 hover:text-foreground/60 transition-colors"
          >
            Explorar artistas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {artist.cover_url ? (
            <img src={artist.cover_url} alt={artist.name} className="h-full w-full object-cover" />
          ) : (
            <div className="img-shimmer h-full w-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 lg:px-12"
        >
          {artist.specialty && (
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">{artist.specialty}</p>
          )}
          <h1 className="font-heading text-6xl font-light leading-none text-white md:text-8xl lg:text-9xl">
            {artist.name}
          </h1>
          {artist.alias && (
            <p className="mt-2 font-heading text-2xl italic text-white/50">&ldquo;{artist.alias}&rdquo;</p>
          )}
          {(artist.city || artist.country) && (
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <MapPin size={14} />
              {[artist.city, artist.country].filter(Boolean).join(', ')}
            </p>
          )}
        </motion.div>

        {/* Botón contacto flotante */}
        {artist.email && (
          <motion.a
            href={`mailto:${artist.email}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="glass fixed bottom-8 right-8 z-40 flex h-16 w-16 flex-col items-center justify-center rounded-full"
          >
            <Mail size={18} className="text-white" />
            <span className="mt-0.5 text-[8px] uppercase tracking-widest text-white">Contactar</span>
          </motion.a>
        )}
      </section>

      {/* Cita inspiradora */}
      {artist.inspiring_quote && (
        <section className="border-t border-border py-20 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <blockquote className="font-heading text-3xl font-light italic leading-tight md:text-5xl">
              &ldquo;{artist.inspiring_quote}&rdquo;
            </blockquote>
          </div>
        </section>
      )}

      {/* Bio + Statement */}
      <section className="border-t border-border py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
            {/* Sidebar */}
            <div className="sticky top-32 h-fit space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Información general</p>
              {[
                { label: 'Nacimiento', value: artist.birth_date },
                { label: 'País', value: artist.country },
                { label: 'Ciudad', value: artist.city },
                { label: 'Idiomas', value: artist.languages?.join(', ') },
                { label: 'Especialidad', value: artist.specialty },
                { label: 'Estilo', value: artist.style },
                { label: 'Técnicas', value: artist.techniques?.join(', ') },
                { label: 'Exposiciones', value: artist.exhibitions_count != null ? String(artist.exhibitions_count) : undefined },
              ].filter((item) => item.value).map((item) => (
                <div key={item.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-xs uppercase tracking-widest text-foreground/40">{item.label}</span>
                  <span className="text-right text-sm text-foreground/80 max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Contenido */}
            <div className="space-y-12">
              {artist.bio && (
                <div>
                  <h2 className="font-heading text-4xl font-light md:text-5xl">Biografía</h2>
                  <p className="mt-6 text-lg leading-relaxed text-foreground/70">{artist.bio}</p>
                </div>
              )}

              {artist.statement && (
                <div>
                  <h3 className="font-heading text-2xl font-light italic">Declaración del artista</h3>
                  <p className="mt-4 text-lg leading-relaxed text-foreground/70">{artist.statement}</p>
                </div>
              )}

              {artist.influences && artist.influences.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Influencias</p>
                  <div className="flex flex-wrap gap-2">
                    {artist.influences.map((inf) => (
                      <span key={inf} className="rounded-full border border-border px-4 py-2 text-sm text-foreground/60">
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {artist.education && artist.education.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Formación</p>
                  <ul className="space-y-2">
                    {artist.education.map((ed) => (
                      <li key={ed} className="text-sm text-foreground/60">— {ed}</li>
                    ))}
                  </ul>
                </div>
              )}

              {artist.awards && artist.awards.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Premios y reconocimientos</p>
                  <ul className="space-y-2">
                    {artist.awards.map((aw) => (
                      <li key={aw} className="flex items-start gap-2 text-sm text-foreground/60">
                        <Award size={14} className="mt-0.5 shrink-0 text-foreground/40" />
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

      {/* Portafolio Masonry */}
      {artworks.length > 0 && (
        <section className="border-t border-border py-20 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Portafolio</p>
            <h2 className="mb-12 font-heading text-5xl font-light md:text-6xl">Obras</h2>

            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {artworks.map((artwork) => (
                <div key={artwork._id} className="mb-6 break-inside-avoid">
                  <button
                    onClick={() => openModal(artwork)}
                    className="group relative w-full overflow-hidden bg-muted"
                    data-cursor="view"
                  >
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer aspect-square" />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="font-heading text-lg text-white">{artwork.title}</p>
                      {artwork.technique && <p className="text-xs text-white/60">{artwork.technique}</p>}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galería inmersiva horizontal */}
      {artworks.length > 0 && (
        <section className="border-t border-border bg-foreground py-20 text-background lg:py-32">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-background/40">Galería inmersiva</p>
            <h2 className="mb-3 font-heading text-4xl font-light text-background md:text-5xl">
              Recorre el espacio de <span className="italic">{artist.name}</span>
            </h2>
            <p className="mb-8 text-sm text-background/40">← Desliza horizontalmente →</p>

            <div className="flex gap-8 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="shrink-0 snap-center"
                  style={{ width: 'min(440px, 75vw)' }}
                >
                  <button
                    onClick={() => openModal(artwork)}
                    className="group relative block w-full overflow-hidden bg-muted"
                    data-cursor="view"
                    style={{ maxHeight: 560 }}
                  >
                    {artwork.image_url ? (
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ maxHeight: 560, objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="img-shimmer aspect-[3/4]" />
                    )}
                  </button>
                  <div className="mt-4">
                    <p className="font-heading text-2xl font-light text-background">{artwork.title}</p>
                    {(artwork.technique || artwork.year) && (
                      <p className="mt-1 text-sm text-background/50">
                        {[artwork.technique, artwork.year].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Servicios */}
      {services.length > 0 && (
        <section className="border-t border-border py-20 lg:py-32">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Servicios</p>
            <h2 className="mb-12 font-heading text-4xl font-light md:text-5xl">
              Trabajar con <span className="italic">{artist.name}</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service._id} className="rounded-lg border border-border p-8 hover:border-foreground transition-colors">
                  <h3 className="font-heading text-2xl font-light">{service.title}</h3>
                  {service.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/50">{service.description}</p>
                  )}
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}?subject=Consulta sobre: ${service.title}`}
                      className="mt-4 inline-block text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
                    >
                      Solicitar información →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section className="border-t border-border py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/40">Contacto directo</p>
              <h2 className="font-heading text-5xl font-light md:text-6xl">Contacto</h2>
              <p className="mt-6 max-w-md text-foreground/50">
                ¿Interesado en adquirir una obra, organizar una exposición o explorar una colaboración?
                Conecta directamente con el artista.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {artist.email && (
                  <a
                    href={`mailto:${artist.email}`}
                    className="glass flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-colors hover:bg-foreground/5"
                  >
                    <Mail size={16} /> {artist.email}
                  </a>
                )}
                {artist.phone && (
                  <a
                    href={`tel:${artist.phone}`}
                    className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:border-foreground transition-colors"
                  >
                    <Phone size={16} /> {artist.phone}
                  </a>
                )}
                {artist.whatsapp && (
                  <a
                    href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:border-foreground transition-colors"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}?subject=Consulta sobre obras`}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-6 py-4 text-sm hover:border-foreground transition-colors"
                >
                  <span>Comprar obras</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              {artist.email && (
                <a
                  href={`mailto:${artist.email}?subject=Reservar presentación`}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-6 py-4 text-sm hover:border-foreground transition-colors"
                >
                  <span>Reservar presentación</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              {artist.email && (
                <a
                  href={`mailto:${artist.email}?subject=Solicitar colaboración`}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-6 py-4 text-sm hover:border-foreground transition-colors"
                >
                  <span>Solicitar colaboración</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de obra */}
      <AnimatePresence>
        {modalArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-border">
              <div>
                <h3 className="font-heading text-3xl font-light leading-tight">{modalArtwork.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">
                  {artist.name} · Obra {modalIndex + 1} de {artworks.length} · ← → para navegar
                </p>
              </div>
              <button
                onClick={() => setModalArtwork(null)}
                className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row">
              {/* Imagen */}
              <div className="relative flex flex-1 items-center justify-center p-6 lg:p-12">
                <button
                  onClick={() => navigateArtwork(-1)}
                  className="absolute left-4 z-10 h-12 w-12 rounded-full border border-border bg-background/80 flex items-center justify-center hover:border-foreground transition-colors"
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
                  className="absolute right-4 z-10 h-12 w-12 rounded-full border border-border bg-background/80 flex items-center justify-center hover:border-foreground transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Panel detalles */}
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
                    ].filter((i) => i.value).map((item) => (
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
                      <p className="font-heading text-2xl">
                        €{modalArtwork.price.toLocaleString('es-ES')}
                      </p>
                      <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                        modalArtwork.sold
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-green-500/10 text-green-600'
                      }`}>
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
    </>
  )
}
