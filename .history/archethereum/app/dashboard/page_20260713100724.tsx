'use client'

import ArtistManager from '@/components/dashboard/ArtistManager'
import ArtworkManager from '@/components/dashboard/ArtworkManager'
import ExhibitionManager from '@/components/dashboard/ExhibitionManager'
import { GalleryHorizontalEnd, Image as ImageIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { id: 'artists', label: 'Artistas', Icon: Users },
  { id: 'exhibitions', label: 'Exposiciones', Icon: GalleryHorizontalEnd },
  { id: 'artworks', label: 'Obras', Icon: ImageIcon },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('artists')

  return (
    <div className="min-h-screen bg-background pb-20 pt-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Volver al sitio
          </Link>
          <h1 className="font-heading text-5xl font-light md:text-6xl">Dashboard</h1>
          <p className="mt-3 text-foreground/50">
            Gestiona artistas, exposiciones y obras de Archethereum.
          </p>
        </div>

        {/* Seed button */}
        <div className="mb-8 rounded-lg border border-border bg-muted/30 p-4">
          <p className="mb-3 text-sm text-foreground/60">
            ¿Primera vez? Inserta datos de prueba para ver la plataforma funcionando:
          </p>
          <button
            onClick={async () => {
              const res = await fetch('/api/seed', { method: 'POST' })
              const data = await res.json()
              alert(data.message || data.error || 'Listo')
              window.location.reload()
            }}
            className="rounded-full border border-border px-6 py-2.5 text-sm hover:border-foreground transition-colors"
          >
            Insertar datos de prueba
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex gap-1 border-b border-border">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'artists' && <ArtistManager />}
        {activeTab === 'exhibitions' && <ExhibitionManager />}
        {activeTab === 'artworks' && <ArtworkManager />}
      </div>
    </div>
  )
}
