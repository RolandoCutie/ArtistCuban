'use client'

import { ChevronDown, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ArtistOption {
  _id: string
  name: string
  specialty?: string
  photo_url?: string
}

interface ArtistAutocompleteProps {
  value: string           // artist_id
  valueName: string       // artist_name (display)
  onChange: (id: string, name: string) => void
  placeholder?: string
  required?: boolean
}

export default function ArtistAutocomplete({
  value,
  valueName,
  onChange,
  placeholder = 'Seleccionar artista',
  required,
}: ArtistAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [artists, setArtists] = useState<ArtistOption[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchArtists = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q.trim()
        ? `/api/artists?admin=true&search=${encodeURIComponent(q)}`
        : '/api/artists?admin=true'
      const res = await fetch(url)
      const data: ArtistOption[] = await res.json()
      setArtists(Array.isArray(data) ? data.slice(0, 20) : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchArtists(query)
  }, [open, query, fetchArtists])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (artist: ArtistOption) => {
    onChange(artist._id, artist.name)
    setOpen(false)
    setQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('', '')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm transition-colors ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/40'
        }`}
      >
        <span className={valueName ? 'text-foreground' : 'text-foreground/40'}>
          {valueName || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {valueName && (
            <span
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown size={14} className={`text-foreground/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={value}
          required
          readOnly
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="shrink-0 text-foreground/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artista..."
              autoFocus
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-foreground/30"
            />
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <div className="space-y-1 p-2">
                {[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-10 rounded" />)}
              </div>
            ) : artists.length === 0 ? (
              <p className="p-4 text-center text-xs text-foreground/40">
                {query ? 'No se encontraron artistas' : 'No hay artistas registrados'}
              </p>
            ) : (
              artists.map((artist) => (
                <button
                  key={artist._id}
                  type="button"
                  onClick={() => handleSelect(artist)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors ${
                    value === artist._id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                    {artist.photo_url ? (
                      <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-foreground/30">
                        {artist.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{artist.name}</p>
                    {artist.specialty && <p className="text-xs text-foreground/40 truncate">{artist.specialty}</p>}
                  </div>
                  {value === artist._id && (
                    <span className="shrink-0 text-[10px] uppercase tracking-widest text-foreground/40">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
