'use client'

import { allSpecialties } from '@/lib/categories'
import { Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ImageUpload from './ImageUpload'

interface Artwork {
  _id: string
  title: string
  series?: string
  technique?: string
  year?: number
  price?: number
  available?: boolean
  sold?: boolean
  image_url?: string
  artist_id: string
  category?: string
  description?: string
  history?: string
  material?: string
  dimensions?: string
  weight?: string
  edition?: string
  certificate?: string
}

interface Artist { _id: string; name: string }

interface ArtworkManagerProps {
  artistId?: string
}

type FormData = Omit<Artwork, '_id'>

const CATEGORIES = allSpecialties

export default function ArtworkManager({ artistId }: ArtworkManagerProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Artwork | null>(null)
  const [creating, setCreating] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm<FormData>()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [awRes, arRes] = await Promise.all([
        fetch(artistId ? `/api/artworks?artist_id=${artistId}` : '/api/artworks'),
        fetch('/api/artists'),
      ])
      setArtworks(await awRes.json())
      setArtists(await arRes.json())
    } finally {
      setLoading(false)
    }
  }, [artistId])

  useEffect(() => { fetchData() }, [fetchData])

  const startEdit = (artwork: Artwork) => {
    setEditing(artwork)
    setCreating(false)
    setImageUrl(artwork.image_url || '')
    reset({ ...artwork })
  }

  const startCreate = () => {
    setEditing(null)
    setCreating(true)
    setImageUrl('')
    reset({ artist_id: artistId || '' })
  }

  const cancel = () => { setEditing(null); setCreating(false) }

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const payload = { ...data, image_url: imageUrl }

      if (editing) {
        await fetch(`/api/artworks/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      cancel()
      fetchData()
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteArtwork = async (id: string) => {
    if (!confirm('¿Eliminar esta obra?')) return
    await fetch(`/api/artworks/${id}`, { method: 'DELETE' })
    fetchData()
  }

  if (creating || editing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Título *</label>
            <input {...register('title', { required: true })} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Serie</label>
            <input {...register('series')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Artista</label>
            <select {...register('artist_id', { required: true })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
              <option value="">Seleccionar artista</option>
              {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Categoría</label>
            <select {...register('category')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
              <option value="">Seleccionar</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Año</label>
            <input {...register('year', { valueAsNumber: true })} type="number" min="1800" max="2100" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Técnica</label>
            <input {...register('technique')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Material</label>
            <input {...register('material')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Dimensiones</label>
            <input {...register('dimensions')} placeholder="ej. 100 × 80 cm" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Peso</label>
            <input {...register('weight')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Edición</label>
            <input {...register('edition')} placeholder="ej. 1/7" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Precio (€)</label>
            <input {...register('price', { valueAsNumber: true })} type="number" min="0" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Certificado</label>
          <input {...register('certificate')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Descripción</label>
          <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Historia</label>
          <textarea {...register('history')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input {...register('available')} type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" />
            Disponible
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input {...register('sold')} type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" />
            Vendida
          </label>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Imagen de la obra</label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} aspect="h-48" label="Subir imagen de la obra" />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : editing ? 'Actualizar obra' : 'Crear obra'}
          </button>
          <button type="button" onClick={cancel} className="rounded-full border border-border px-8 py-3 text-sm hover:border-foreground transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-2xl font-light">Obras ({artworks.length})</h3>
        <button onClick={startCreate} className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
          + Nueva obra
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="img-shimmer aspect-[3/4] rounded-lg" />)}
        </div>
      ) : artworks.length === 0 ? (
        <p className="text-center text-foreground/50 py-12">No hay obras. ¡Añade la primera!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artworks.map((artwork) => (
            <div key={artwork._id} className="group relative overflow-hidden rounded-lg border border-border">
              <div className="h-40 overflow-hidden bg-muted">
                {artwork.image_url ? (
                  <img src={artwork.image_url} alt={artwork.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="img-shimmer h-full w-full" />
                )}
                {artwork.sold && (
                  <div className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                    Vendida
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-heading text-base font-medium leading-tight">{artwork.title}</p>
                <p className="text-xs text-foreground/50">{[artwork.technique, artwork.year].filter(Boolean).join(' · ')}</p>
                {artwork.price && (
                  <p className="mt-1 text-sm font-medium">€{artwork.price.toLocaleString('es-ES')}</p>
                )}
              </div>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(artwork)} className="h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => deleteArtwork(artwork._id)} className="h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors text-destructive">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
