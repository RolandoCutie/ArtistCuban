'use client'

import { getTemplate } from '@/lib/templates'
import { useCallback, useEffect, useState } from 'react'
import LayoutBrutal from './LayoutBrutal'
import LayoutCinematic from './LayoutCinematic'
import LayoutEditorial from './LayoutEditorial'
import LayoutEmerald from './LayoutEmerald'
import LayoutGlass from './LayoutGlass'
import LayoutLuxury from './LayoutLuxury'
import LayoutMinimal from './LayoutMinimal'
import LayoutModern from './LayoutModern'
import LayoutMuseum from './LayoutMuseum'
import LayoutOrganic from './LayoutOrganic'
import type { Artist, Artwork, Exhibition, Service } from './types'

const TEMPLATE_LAYOUT: Record<string, string> = {
  template1: 'editorial',
  template4: 'museum',
  template2: 'luxury',
  template6: 'glass',
  template3: 'cinematic',
  template8: 'emerald',
  template5: 'modern',
  template7: 'minimal',
  template9: 'organic',
  template10: 'brutal',
}

interface Props {
  artist: Artist
  artworks: Artwork[]
  services: Service[]
  exhibitions: Exhibition[]
}

// Only the modal state lives client-side; data comes from server
export default function ArtistViewer({ artist, artworks, services, exhibitions }: Props) {
  const [modalArtwork, setModalArtwork] = useState<Artwork | null>(null)
  const [modalIndex, setModalIndex] = useState(0)

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
    exhibitions,
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
