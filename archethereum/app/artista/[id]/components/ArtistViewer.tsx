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
  previewTemplate?: string
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num))
}

function shiftHslTriplet(value: string, hueShift: number, satShift: number, lightShift: number): string {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/)
  if (!match) return value

  const hue = Number(match[1])
  const sat = Number(match[2])
  const light = Number(match[3])

  const nextHue = ((hue + hueShift) % 360 + 360) % 360
  const nextSat = clamp(sat + satShift, 0, 100)
  const nextLight = clamp(light + lightShift, 0, 100)

  return `${Math.round(nextHue)} ${Math.round(nextSat)}% ${Math.round(nextLight)}%`
}

// Only the modal state lives client-side; data comes from server
export default function ArtistViewer({ artist, artworks, services, exhibitions, previewTemplate }: Props) {
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

  const templateId = previewTemplate ?? artist.template
  const tpl = getTemplate(templateId)
  const layoutType = TEMPLATE_LAYOUT[templateId ?? 'template1'] ?? 'editorial'

  const artistSeed = hashString(`${artist._id}:${artist.name}:${templateId ?? 'template1'}`)
  const hueShift = (artistSeed % 29) - 14
  const satShift = ((artistSeed >> 3) % 9) - 4
  const lightShift = ((artistSeed >> 6) % 7) - 3

  const dynamicCssVars = Object.entries(tpl.cssVars).reduce(
    (acc, [key, val]) => {
      if (key === '--accent') {
        acc[key] = shiftHslTriplet(val, hueShift, satShift, lightShift)
        return acc
      }
      if (key === '--ring') {
        acc[key] = shiftHslTriplet(val, hueShift, satShift, lightShift)
        return acc
      }
      if (key === '--primary') {
        acc[key] = shiftHslTriplet(val, Math.round(hueShift * 0.45), Math.round(satShift * 0.5), 0)
        return acc
      }
      if (key === '--border') {
        acc[key] = shiftHslTriplet(val, Math.round(hueShift * 0.35), 0, 0)
        return acc
      }

      acc[key] = val
      return acc
    },
    {} as Record<string, string>,
  )

  const auraHueA = artistSeed % 360
  const auraHueB = (auraHueA + 72 + (artistSeed % 34)) % 360
  const auraHueC = (auraHueA + 188) % 360

  const tplStyle = {
    ...Object.entries(dynamicCssVars).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v }),
      {} as React.CSSProperties,
    ),
    ['--font-heading' as string]: tpl.fontHeading,
    ['--font-display' as string]: tpl.fontHeading,
    ['--font-body' as string]: tpl.fontBody,
    fontFamily: 'var(--font-body)',
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
  } as React.CSSProperties

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
    <div style={tplStyle} className={`relative isolate min-h-screen${tpl.accentClass ? ` ${tpl.accentClass}` : ''}`}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          opacity: layoutType === 'minimal' || layoutType === 'museum' ? 0.16 : 0.24,
          backgroundImage: `
            radial-gradient(46rem 30rem at 12% 14%, hsla(${auraHueA}, 80%, 56%, 0.36), transparent 70%),
            radial-gradient(38rem 26rem at 84% 10%, hsla(${auraHueB}, 78%, 50%, 0.32), transparent 72%),
            radial-gradient(34rem 24rem at 56% 92%, hsla(${auraHueC}, 74%, 54%, 0.3), transparent 70%)
          `,
        }}
      />
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
