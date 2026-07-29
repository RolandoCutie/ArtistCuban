'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ImageUpload from '@/components/dashboard/ImageUpload'
import {
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    GalleryHorizontal,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Artist { _id: string; name: string }
interface Artwork { _id: string; title: string; image_url?: string; technique?: string; artist_id: string }

interface Exhibition {
  _id: string
  title: string
  type: string
  curator?: string
  artist_id?: string
  artist_ids: string[]
  date?: string
  end_date?: string
  description?: string
  cover_url?: string
  banner_url?: string
  gallery_urls: string[]
  status: string
  schedule?: string
  venue?: string
  location?: string
  sponsors: string[]
  artwork_ids: string[]
  visible: boolean
  tags: string[]
}

type FormData = Omit<Exhibition, '_id' | 'artist_ids' | 'artwork_ids' | 'gallery_urls' | 'sponsors' | 'tags' | 'visible'>

const TYPE_OPTIONS = [
  { value: 'solo', label: 'Individual' },
  { value: 'collective', label: 'Colectiva' },
  { value: 'gallery', label: 'Galería' },
  { value: 'museum', label: 'Museo' },
  { value: 'event', label: 'Evento' },
  { value: 'fair', label: 'Feria' },
]

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

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Exhibition | null>(null)
  const [creating, setCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [coverUrl, setCoverUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([])
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([])
  const [sponsorInput, setSponsorInput] = useState('')
  const [sponsors, setSponsors] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [visible, setVisible] = useState(true)

  const { register, handleSubmit, reset } = useForm<FormData>()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [exRes, arRes, awRes] = await Promise.all([
        fetch('/api/exhibitions'),
        fetch('/api/artists?admin=true'),
        fetch('/api/artworks'),
      ])
      const [exData, arData, awData] = await Promise.all([exRes.json(), arRes.json(), awRes.json()])
      setExhibitions(Array.isArray(exData) ? exData : [])
      setArtists(Array.isArray(arData) ? arData : [])
      setAllArtworks(Array.isArray(awData) ? awData : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const resetForm = () => {
    reset({ type: 'solo', status: 'upcoming' })
    setCoverUrl('')
    setBannerUrl('')
    setSelectedArtistIds([])
    setSelectedArtworkIds([])
    setSponsors([])
    setTags([])
    setSponsorInput('')
    setTagInput('')
    setVisible(true)
  }

  const startCreate = () => {
    setEditing(null)
    setCreating(true)
    resetForm()
  }

  const startEdit = (ex: Exhibition) => {
    setEditing(ex)
    setCreating(false)
    setCoverUrl(ex.cover_url || '')
    setBannerUrl(ex.banner_url || '')
    setSelectedArtistIds(ex.artist_ids || [])
    setSelectedArtworkIds(ex.artwork_ids || [])
    setSponsors(ex.sponsors || [])
    setTags(ex.tags || [])
    setVisible(ex.visible !== false)
    reset({ ...ex })
  }

  const cancel = () => {
    setEditing(null)
    setCreating(false)
  }

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        cover_url: coverUrl,
        banner_url: bannerUrl,
        artist_ids: selectedArtistIds,
        artwork_ids: selectedArtworkIds,
        sponsors,
        tags,
        visible,
      }

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
    if (!confirm('¿Eliminar esta exposición permanentemente?')) return
    await fetch(`/api/exhibitions/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const toggleArtist = (id: string) =>
    setSelectedArtistIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const toggleArtwork = (id: string) =>
    setSelectedArtworkIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const moveArtwork = (id: string, dir: 'up' | 'down') => {
    setSelectedArtworkIds((prev) => {
      const idx = prev.indexOf(id)
      if (idx < 0) return prev
      const next = [...prev]
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  const addSponsor = () => {
    const val = sponsorInput.trim()
    if (val && !sponsors.includes(val)) setSponsors((p) => [...p, val])
    setSponsorInput('')
  }

  const addTag = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val)) setTags((p) => [...p, val])
    setTagInput('')
  }

  if (creating || editing) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-3xl font-light">
              {editing ? 'Editar exposición' : 'Nueva exposición'}
            </h1>
            <button onClick={cancel} className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
              <X size={16} /> Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Información básica */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Información básica</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Título *</label>
                  <input {...register('title', { required: true })} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Tipo</label>
                  <select {...register('type')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
                    {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Estado</label>
                  <select {...register('status')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Curador</label>
                  <input {...register('curator')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Sede</label>
                  <input {...register('venue')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Ubicación</label>
                  <input {...register('location')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" placeholder="Ciudad, País" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Horario</label>
                  <input {...register('schedule')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Fecha inicio</label>
                  <input {...register('date')} type="date" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Fecha fin</label>
                  <input {...register('end_date')} type="date" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Descripción</label>
                  <textarea {...register('description')} rows={4} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <label className="text-xs uppercase tracking-widest text-foreground/40">Visible en el sitio público</label>
                  <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs transition-colors ${visible ? 'bg-green-500/10 text-green-600' : 'bg-muted text-foreground/40'}`}
                  >
                    {visible ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Oculta</>}
                  </button>
                </div>
              </div>
            </section>

            {/* Imágenes */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Imágenes</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Portada</label>
                  <ImageUpload value={coverUrl} onChange={setCoverUrl} aspect="h-44" label="Subir portada" />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Banner</label>
                  <ImageUpload value={bannerUrl} onChange={setBannerUrl} aspect="h-44" label="Subir banner" />
                </div>
              </div>
            </section>

            {/* Artistas */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">
                Artistas ({selectedArtistIds.length} seleccionados)
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {artists.map((a) => (
                  <label
                    key={a._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedArtistIds.includes(a._id) ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtistIds.includes(a._id)}
                      onChange={() => toggleArtist(a._id)}
                      className="h-4 w-4 accent-foreground"
                    />
                    <span className="text-sm">{a.name}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Obras */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">
                Obras ({selectedArtworkIds.length} seleccionadas)
              </h2>
              {/* Selected artworks with order controls */}
              {selectedArtworkIds.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs text-foreground/40">Orden en la exposición (arrastra o usa las flechas):</p>
                  {selectedArtworkIds.map((id, idx) => {
                    const aw = allArtworks.find((a) => a._id === id)
                    if (!aw) return null
                    return (
                      <div key={id} className="flex items-center gap-3 rounded-lg border border-foreground/20 bg-foreground/5 p-2.5">
                        <span className="w-5 shrink-0 text-center text-xs text-foreground/30">{idx + 1}</span>
                        {aw.image_url && <img src={aw.image_url} alt={aw.title} className="h-10 w-10 rounded-md object-cover" />}
                        <span className="flex-1 truncate text-sm">{aw.title}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveArtwork(id, 'up')} disabled={idx === 0} className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors">
                            <ChevronUp size={12} />
                          </button>
                          <button type="button" onClick={() => moveArtwork(id, 'down')} disabled={idx === selectedArtworkIds.length - 1} className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors">
                            <ChevronDown size={12} />
                          </button>
                          <button type="button" onClick={() => toggleArtwork(id)} className="flex h-6 w-6 items-center justify-center rounded text-destructive hover:bg-destructive/10 transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {allArtworks.map((aw) => (
                  <label
                    key={aw._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedArtworkIds.includes(aw._id) ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/40'
                    }`}
                  >
                    <input type="checkbox" checked={selectedArtworkIds.includes(aw._id)} onChange={() => toggleArtwork(aw._id)} className="h-4 w-4 accent-foreground" />
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {aw.image_url && <img src={aw.image_url} alt={aw.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{aw.title}</p>
                      {aw.technique && <p className="truncate text-xs text-foreground/40">{aw.technique}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Patrocinadores */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Patrocinadores</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sponsorInput}
                  onChange={(e) => setSponsorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSponsor())}
                  placeholder="Nombre del patrocinador + Enter"
                  className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none"
                />
                <button type="button" onClick={addSponsor} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:border-foreground transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              {sponsors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sponsors.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs">
                      {s}
                      <button type="button" onClick={() => setSponsors((p) => p.filter((x) => x !== s))} className="text-foreground/40 hover:text-foreground transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Tags */}
            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.3em] text-foreground/40 border-b border-border pb-2">Etiquetas</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Etiqueta + Enter"
                  className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none"
                />
                <button type="button" onClick={addTag} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:border-foreground transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs">
                      {t}
                      <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))} className="text-foreground/40 hover:text-foreground transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            <div className="flex gap-3 border-t border-border pt-6">
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
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl font-light">Exposiciones</h1>
            <p className="mt-1 text-sm text-foreground/50">
              Gestiona exposiciones globales: individuales, colectivas, galerías, museos y ferias.
            </p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus size={14} /> Nueva exposición
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-48 rounded-xl" />)}
          </div>
        ) : exhibitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <GalleryHorizontal size={40} className="mb-4 text-foreground/20" />
            <p className="text-lg font-heading font-light">Sin exposiciones</p>
            <p className="mt-1 text-sm text-foreground/40">Crea la primera exposición del sistema.</p>
            <button onClick={startCreate} className="mt-6 flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
              <Plus size={14} /> Crear exposición
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exhibitions.map((ex) => {
              const typeLabel = TYPE_OPTIONS.find((t) => t.value === ex.type)?.label || ex.type
              return (
                <div key={ex._id} className="group relative overflow-hidden rounded-xl border border-border hover:border-foreground/30 transition-all duration-300">
                  {/* Cover */}
                  <div className="relative h-40 bg-muted overflow-hidden">
                    {ex.cover_url ? (
                      <img src={ex.cover_url} alt={ex.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <GalleryHorizontal size={32} className="text-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {!ex.visible && (
                      <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white/80">
                        <EyeOff size={10} /> Oculta
                      </span>
                    )}
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${STATUS_BADGE[ex.status] || ''}`}>
                      {STATUS_OPTIONS.find((s) => s.value === ex.status)?.label}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-foreground/50">{typeLabel}</span>
                      {ex.artist_ids?.length > 0 && (
                        <span className="text-[10px] text-foreground/40">{ex.artist_ids.length} artista{ex.artist_ids.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <p className="font-heading text-lg leading-tight">{ex.title}</p>
                    {ex.curator && <p className="mt-0.5 text-xs text-foreground/40">Curador: {ex.curator}</p>}
                    {ex.venue && <p className="mt-0.5 text-xs text-foreground/40">{ex.venue}</p>}
                    {ex.date && <p className="mt-1 text-xs text-foreground/40">{ex.date}{ex.end_date ? ` → ${ex.end_date}` : ''}</p>}
                    <p className="mt-1 text-xs text-foreground/40">{ex.artwork_ids?.length || 0} obra{ex.artwork_ids?.length !== 1 ? 's' : ''}</p>
                  </div>

                  <div className="flex border-t border-border">
                    <button
                      onClick={() => startEdit(ex)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-xs text-foreground/50 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Pencil size={12} /> Editar
                    </button>
                    <div className="w-px bg-border" />
                    <button
                      onClick={() => deleteExhibition(ex._id)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-xs text-destructive/70 hover:bg-destructive/5 hover:text-destructive transition-colors"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
