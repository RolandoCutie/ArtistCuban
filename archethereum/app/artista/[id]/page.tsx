'use client'

import { getTemplate } from '@/lib/templates'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import LayoutBrutal from './components/LayoutBrutal'
import LayoutCinematic from './components/LayoutCinematic'
import LayoutEditorial from './components/LayoutEditorial'
import LayoutEmerald from './components/LayoutEmerald'
import LayoutGlass from './components/LayoutGlass'
import LayoutLuxury from './components/LayoutLuxury'
import LayoutMinimal from './components/LayoutMinimal'
import LayoutModern from './components/LayoutModern'
import LayoutMuseum from './components/LayoutMuseum'
import LayoutOrganic from './components/LayoutOrganic'
import type { Artist, Artwork, Service } from './components/types'

// Cada plantilla tiene su propio layout: distinta posición de elementos, ritmo y estructura
const TEMPLATE_LAYOUT: Record<
  string,
  'editorial' | 'cinematic' | 'modern' | 'organic' | 'luxury' | 'brutal' | 'museum' | 'glass' | 'minimal' | 'emerald'
> = {
  template1: 'editorial',  // Clasica crema - galeria editorial de portada oscura
  template4: 'museum',     // Museo Crema - institucion museo con placas y pared colgada
  template2: 'luxury',     // Blanca Dorada - editorial de lujo con marcos y dorados
  template6: 'glass',      // Premium Oscuro - glassmorphism oscuro con orbes de luz
  template3: 'cinematic',  // Noche Cobre - cinematografico dramatico
  template8: 'emerald',    // Esmeralda - inmersion esmeralda de lujo
  template5: 'modern',     // Creativa - portfolio split moderno
  template7: 'minimal',    // Minimalista - indice tipografico puro
  template9: 'organic',    // Terracota - mediterraneo calido organico
  template10: 'brutal',    // Brutalista - estetica radical y cruda
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openModal = (artwork: Artwork) => {
    const idx = artworks.findIndex((a) => a._id === artwork._id)
    setModalIndex(idx)
    setModalArtwork(artwork)
  }

  const navigateArtwork = useCallback(
    (dir: 1 | -1) => {
      const newIdx = (modalIndex + dir + artworks.length) % artworks.length
      setModalIndex(newIdx)
      setModalArtwork(artworks[newIdx])
    },
    [modalIndex, artworks],
  )

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
        <Link
          href="/"
          className="text-sm underline text-foreground/40 transition-colors hover:text-foreground"
        >
          ← Volver al inicio
        </Link>
      </div>
    )
  }

  if (artist.is_active === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-foreground/30">Archethereum</p>
          <h1 className="font-heading text-4xl font-light leading-tight text-foreground/60 md:text-5xl">
            Este artista no se encuentra
            <br />
            <span className="italic">disponible en este momento</span>
          </h1>
          <p className="mt-6 text-sm text-foreground/40">
            El perfil de este artista no esta activo actualmente.
            <br />
            Por favor, vuelve mas tarde o explora otros artistas.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:border-foreground/60 hover:text-foreground/60"
          >
            Explorar artistas
          </Link>
        </div>
      </div>
    )
  }

  const tpl = getTemplate(artist.template)
  const tplStyle: React.CSSProperties = {
    ...Object.entries(tpl.cssVars).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v }),
      {} as React.CSSProperties,
    ),
    fontFamily: tpl.fontBody,
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
  }

  const layoutType = TEMPLATE_LAYOUT[artist.template ?? 'template1'] ?? 'editorial'

  const layoutProps = {
    artist,
    artworks,
    services,
    modalArtwork,
    modalIndex,
    openModal,
    navigateArtwork,
    closeModal: () => setModalArtwork(null),
  }

  return (
    <div style={tplStyle} className={`min-h-screen${tpl.accentClass ? ` ${tpl.accentClass}` : ''}`}>
      {layoutType === 'editorial' && <LayoutEditorial {...layoutProps} />}
      {layoutType === 'cinematic' && <LayoutCinematic {...layoutProps} />}
      {layoutType === 'modern' && <LayoutModern {...layoutProps} />}
      {layoutType === 'organic' && <LayoutOrganic {...layoutProps} />}
      {layoutType === 'luxury' && <LayoutLuxury {...layoutProps} />}
      {layoutType === 'brutal' && <LayoutBrutal {...layoutProps} />}
      {layoutType === 'museum' && <LayoutMuseum {...layoutProps} />}
      {layoutType === 'glass' && <LayoutGlass {...layoutProps} />}
      {layoutType === 'minimal' && <LayoutMinimal {...layoutProps} />}
      {layoutType === 'emerald' && <LayoutEmerald {...layoutProps} />}
    </div>
  )
}
