'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ImageUpload from './ImageUpload'

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
  status: string
  schedule?: string
  venue?: string
  artwork_ids: string[]
}

interface Artist { _id: string; name: string }
interface Artwork { _id: string; title: string; technique?: string; image_url?: string; artist_id: string }

interface ExhibitionManagerProps {
  artistId?: string
}

type FormData = Omit<Exhibition, '_id' | 'artwork_ids'>

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Próxima' },
  { value: 'active', label: 'Activa' },
  { value: 'past', label: 'Pasada' },
]

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/10 text-green-600',
  upcoming: 'bg-blue-500/10 text-blue-600',
  past: 'bg-foreground/10 text-foreground/40',
}

export default function ExhibitionManager({ artistId }: ExhibitionManagerProps) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Exhibition | null>(null)
  const [creating, setCreating] = useState(false)
  const [coverUrl, setCoverUrl] = useState('')
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([])
  const [selectedArtistId, setSelectedArtistId] = useState(artistId || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm<FormData>()
  const watchArtistId = watch('artist_id', artistId)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [exRes, arRes] = await Promise.all([
        fetch('/api/exhibitions'),
        fetch('/api/artists'),
      ])
      const exData = await exRes.json()
      const arData = await arRes.json()
      setExhibitions(artistId ? exData.filter((e: Exhibition) => e.artist_id === artistId) : exData)
      setArtists(arData)
    } finally {
      setLoading(false)
    }
  }, [artistId])

  const fetchArtworks = useCallback(async (aId: string) => {
    if (!aId) { setArtworks([]); return }
    const res = await fetch(`/api/artworks?artist_id=${aId}`)
    setArtworks(await res.json())
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const id = watchArtistId || selectedArtistId
    if (id) fetchArtworks(id)
  }, [watchArtistId, selectedArtistId, fetchArtworks])

  const startEdit = (ex: Exhibition) => {
    setEditing(ex)
    setCreating(false)
    setCoverUrl(ex.cover_url || '')
    setSelectedArtworkIds(ex.artwork_ids || [])
    setSelectedArtistId(ex.artist_id || artistId || '')
    reset({ ...ex })
  }

  const startCreate = () => {
    setEditing(null)
    setCreating(true)
    setCoverUrl('')
    setSelectedArtworkIds([])
    setSelectedArtistId(artistId || '')
    reset({ artist_id: artistId, status: 'upcoming' })
  }

  const cancel = () => { setEditing(null); setCreating(false) }

  const toggleArtwork = (id: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const payload = { ...data, cover_url: coverUrl, artwork_ids: selectedArtworkIds }

      if (editing) {
        await fetch(`/api/exhibitions/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/exhibitions', {
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

  const deleteExhibition = async (id: string) => {
    if (!confirm('¿Eliminar esta exposición?')) return
    await fetch(`/api/exhibitions/${id}`, { method: 'DELETE' })
    fetchData()
  }

  if (creating || editing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Título *</label>
            <input {...register('title', { required: true })} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Curador</label>
            <input {...register('curator')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Artista</label>
            <select
              {...register('artist_id')}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none"
              onChange={(e) => setSelectedArtistId(e.target.value)}
            >
              <option value="">Seleccionar artista</option>
              {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Estado</label>
            <select {...register('status')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Fecha inicio</label>
            <input {...register('date')} type="date" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Fecha fin</label>
            <input {...register('end_date')} type="date" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Sede</label>
            <input {...register('venue')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Horario</label>
            <input {...register('schedule')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Descripción</label>
            <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
          </div>
        </div>

        {/* Selector de obras */}
        {artworks.length > 0 && (
          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-foreground/40">
              Obras de la exposición ({selectedArtworkIds.length} seleccionadas)
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((aw) => (
                <label
                  key={aw._id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedArtworkIds.includes(aw._id)
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedArtworkIds.includes(aw._id)}
                    onChange={() => toggleArtwork(aw._id)}
                    className="h-4 w-4 accent-foreground"
                  />
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {aw.image_url && <img src={aw.image_url} alt={aw.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{aw.title}</p>
                    {aw.technique && <p className="text-xs text-foreground/40 truncate">{aw.technique}</p>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Imagen de portada</label>
          <ImageUpload value={coverUrl} onChange={setCoverUrl} aspect="h-40" label="Subir portada de la exposición" />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : editing ? 'Actualizar exposición' : 'Crear exposición'}
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
        <h3 className="font-heading text-2xl font-light">Exposiciones ({exhibitions.length})</h3>
        <button onClick={startCreate} className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
          + Nueva exposición
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="img-shimmer h-20 rounded-lg" />)}
        </div>
      ) : exhibitions.length === 0 ? (
        <p className="text-center text-foreground/50 py-12">No hay exposiciones.</p>
      ) : (
        <div className="space-y-3">
          {exhibitions.map((ex) => (
            <div key={ex._id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-foreground/30 transition-colors">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
                {ex.cover_url && <img src={ex.cover_url} alt={ex.title} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading text-lg leading-tight">{ex.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_BADGE[ex.status] || ''}`}>
                    {STATUS_OPTIONS.find((o) => o.value === ex.status)?.label}
                  </span>
                </div>
                {ex.artist_name && <p className="text-sm text-foreground/50">{ex.artist_name}</p>}
                {ex.date && (
                  <p className="text-xs text-foreground/40">
                    {new Date(ex.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {ex.venue && ` · ${ex.venue}`}
                  </p>
                )}
                <p className="text-xs text-foreground/30">{ex.artwork_ids?.length || 0} obras</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(ex)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteExhibition(ex._id)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-destructive">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
