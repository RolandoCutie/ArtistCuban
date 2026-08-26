'use client'

import ArtworkManager from '@/components/dashboard/ArtworkManager'
import ExhibitionManager from '@/components/dashboard/ExhibitionManager'
import { Image as ImageIcon, Theater } from 'lucide-react'
import { useState } from 'react'

const TABS = [
  { id: 'artworks', label: 'Obras', Icon: ImageIcon },
  { id: 'exhibitions', label: 'Exposiciones', Icon: Theater },
]

export default function CatalogoPage() {
  const [activeTab, setActiveTab] = useState('artworks')

  return (
    
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-light">Catálogo</h1>
          <p className="mt-1 text-sm text-foreground/50">Obras y exposiciones</p>
        </div>
        <div className="flex gap-1 border-b border-border">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === id ? 'border-foreground text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        {activeTab === 'artworks' && <ArtworkManager />}
        {activeTab === 'exhibitions' && <ExhibitionManager />}
      </div>
    
  )
}
