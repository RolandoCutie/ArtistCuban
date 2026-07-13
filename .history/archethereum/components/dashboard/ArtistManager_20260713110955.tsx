'use client'

import { allSpecialties } from '@/lib/categories'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ArtworkManager from './ArtworkManager'
import ExhibitionManager from './ExhibitionManager'
import ImageUpload from './ImageUpload'
import ServiceManager from './ServiceManager'

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
  inspiring_quote?: string
}

type FormData = Omit<Artist, '_id' | 'categories' | 'languages' | 'influences' | 'techniques' | 'education' | 'awards'> & {
  languages_str?: string
  influences_str?: string
  techniques_str?: string
  education_str?: string
  awards_str?: string
}

const CATEGORIES = [
  'Pintura', 'Escultura', 'Fotografía', 'Arte Digital', 'Música',
  'Performance', 'Moda', 'Arquitectura', 'Ilustración', 'Cerámica',
  'Grabado', 'Danza', 'Teatro', 'Arte Urbano',
]

const EDIT_TABS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'artworks', label: 'Obras' },
  { id: 'exhibitions', label: 'Exposiciones' },
  { id: 'services', label: 'Servicios' },
]

export default function ArtistManager() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Artist | null>(null)
  const [creating, setCreating] = useState(false)
  const [editTab, setEditTab] = useState('profile')
  const [photoUrl, setPhotoUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>()

  const fetchArtists = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/artists')
      setArtists(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchArtists() }, [fetchArtists])

  const startEdit = (artist: Artist) => {
    setEditing(artist)
    setCreating(false)
    setEditTab('profile')
    setPhotoUrl(artist.photo_url || '')
    setCoverUrl(artist.cover_url || '')
    setSelectedCategories(artist.categories || [])
    reset({
      name: artist.name,
      alias: artist.alias,
      specialty: artist.specialty,
      category: artist.category,
      country: artist.country,
      city: artist.city,
      bio: artist.bio,
      statement: artist.statement,
      birth_date: artist.birth_date,
      style: artist.style,
      exhibitions_count: artist.exhibitions_count,
      email: artist.email,
      phone: artist.phone,
      whatsapp: artist.whatsapp,
      is_featured: artist.is_featured,
      inspiring_quote: artist.inspiring_quote,
      languages_str: artist.languages?.join(', '),
      influences_str: artist.influences?.join(', '),
      techniques_str: artist.techniques?.join(', '),
      education_str: artist.education?.join(', '),
      awards_str: artist.awards?.join(', '),
    })
  }

  const startCreate = () => {
    setEditing(null)
    setCreating(true)
    setPhotoUrl('')
    setCoverUrl('')
    setSelectedCategories([])
    reset({})
  }

  const cancel = () => { setEditing(null); setCreating(false) }

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      categories: selectedCategories,
      photo_url: photoUrl,
      cover_url: coverUrl,
      languages: data.languages_str?.split(',').map((s) => s.trim()).filter(Boolean),
      influences: data.influences_str?.split(',').map((s) => s.trim()).filter(Boolean),
      techniques: data.techniques_str?.split(',').map((s) => s.trim()).filter(Boolean),
      education: data.education_str?.split(',').map((s) => s.trim()).filter(Boolean),
      awards: data.awards_str?.split(',').map((s) => s.trim()).filter(Boolean),
    }

    if (editing) {
      await fetch(`/api/artists/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    cancel()
    fetchArtists()
  }

  const deleteArtist = async (id: string) => {
    if (!confirm('¿Eliminar este artista?')) return
    await fetch(`/api/artists/${id}`, { method: 'DELETE' })
    fetchArtists()
  }

  if (creating || (editing && editTab === 'profile')) {
    return (
      <div className="space-y-8">
        {editing && (
          <div className="flex gap-1 border-b border-border">
            {EDIT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEditTab(tab.id)}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  editTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-foreground/50 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <div>
            <h3 className="font-heading text-xl mb-4">Información básica</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Nombre *</label>
                <input {...register('name', { required: true })} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Alias</label>
                <input {...register('alias')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Especialidad</label>
                <select {...register('specialty')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
                  <option value="">Seleccionar</option>
                  {allSpecialties.map((s) => <option key={s} value={s}>{s}</option>)}
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
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Fecha de nacimiento</label>
                <input {...register('birth_date')} type="date" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Nº Exposiciones</label>
                <input {...register('exhibitions_count', { valueAsNumber: true })} type="number" min="0" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="font-heading text-xl mb-4">Ubicación</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">País</label>
                <input {...register('country')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Ciudad</label>
                <input {...register('city')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div>
            <h3 className="font-heading text-xl mb-4">Biografía y declaración</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Biografía</label>
                <textarea {...register('bio')} rows={4} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Declaración del artista</label>
                <textarea {...register('statement')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Cita inspiradora</label>
                <input {...register('inspiring_quote')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Detalles profesionales */}
          <div>
            <h3 className="font-heading text-xl mb-4">Detalles profesionales</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Estilo</label>
                <input {...register('style')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Idiomas (separados por coma)</label>
                <input {...register('languages_str')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Técnicas (separadas por coma)</label>
                <input {...register('techniques_str')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Influencias (separadas por coma)</label>
                <input {...register('influences_str')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Educación (separada por coma)</label>
                <input {...register('education_str')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Premios (separados por coma)</label>
                <input {...register('awards_str')} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-heading text-xl mb-4">Contacto</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Email</label>
                <input {...register('email')} type="email" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Teléfono</label>
                <input {...register('phone')} type="tel" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">WhatsApp</label>
                <input {...register('whatsapp')} type="tel" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <h3 className="font-heading text-xl mb-4">Imágenes</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Foto de perfil</label>
                <ImageUpload value={photoUrl} onChange={setPhotoUrl} aspect="h-40" label="Subir foto de perfil" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">Imagen de portada</label>
                <ImageUpload value={coverUrl} onChange={setCoverUrl} aspect="h-40" label="Subir portada" />
              </div>
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register('is_featured')} type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" />
            <span className="text-sm">Artista destacado (aparece en la sección principal)</span>
          </label>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="rounded-full bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90 transition-colors"
            >
              {editing ? 'Actualizar artista' : 'Crear artista'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-full border border-border px-8 py-3 text-sm hover:border-foreground transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (editing && editTab === 'artworks') {
    return (
      <div className="space-y-6">
        <div className="flex gap-1 border-b border-border">
          {EDIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEditTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                editTab === tab.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ArtworkManager artistId={editing._id} />
      </div>
    )
  }

  if (editing && editTab === 'exhibitions') {
    return (
      <div className="space-y-6">
        <div className="flex gap-1 border-b border-border">
          {EDIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEditTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                editTab === tab.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ExhibitionManager artistId={editing._id} />
      </div>
    )
  }

  if (editing && editTab === 'services') {
    return (
      <div className="space-y-6">
        <div className="flex gap-1 border-b border-border">
          {EDIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEditTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                editTab === tab.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ServiceManager artistId={editing._id} />
      </div>
    )
  }

  // Lista de artistas
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-2xl font-light">Artistas ({artists.length})</h3>
        <button
          onClick={startCreate}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors"
        >
          + Nuevo artista
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="img-shimmer h-24 rounded-lg" />)}
        </div>
      ) : artists.length === 0 ? (
        <p className="text-center text-foreground/50 py-12">No hay artistas. ¡Crea el primero!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div key={artist._id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-foreground/30 transition-colors">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full img-shimmer" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading text-lg leading-tight truncate">{artist.name}</p>
                  {artist.is_featured && <Star size={12} className="shrink-0 fill-current text-yellow-500" />}
                </div>
                <p className="text-sm text-foreground/50 truncate">{[artist.specialty, artist.city].filter(Boolean).join(' · ')}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(artist)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteArtist(artist._id)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-destructive">
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
