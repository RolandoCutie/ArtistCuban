'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2 } from 'lucide-react'

interface Service {
  _id: string
  title: string
  description?: string
  artist_id: string
  icon_name?: string
}

interface Artist { _id: string; name: string }
interface ServiceManagerProps { artistId?: string }
type FormData = Omit<Service, '_id'>

const ICON_OPTIONS = [
  'Brush', 'GraduationCap', 'Compass', 'Building2', 'Gem',
  'Sparkles', 'Palette', 'PenTool', 'Lightbulb', 'Heart', 'Star', 'Award',
]

export default function ServiceManager({ artistId }: ServiceManagerProps) {
  const [services, setServices] = useState<Service[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)

  const { register, handleSubmit, reset } = useForm<FormData>()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [svRes, arRes] = await Promise.all([
        fetch(artistId ? `/api/services?artist_id=${artistId}` : '/api/services'),
        fetch('/api/artists'),
      ])
      setServices(await svRes.json())
      setArtists(await arRes.json())
    } finally {
      setLoading(false)
    }
  }, [artistId])

  useEffect(() => { fetchData() }, [fetchData])

  const startEdit = (service: Service) => {
    setEditing(service)
    setCreating(false)
    reset({ ...service })
  }

  const startCreate = () => {
    setEditing(null)
    setCreating(true)
    reset({ artist_id: artistId || '' })
  }

  const cancel = () => { setEditing(null); setCreating(false) }

  const onSubmit = async (data: FormData) => {
    if (editing) {
      await fetch(`/api/services/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    cancel()
    fetchData()
  }

  const deleteService = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    fetchData()
  }

  if (creating || editing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Título *</label>
            <input {...register('title', { required: true })} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
          </div>
          {!artistId && (
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Artista</label>
              <select {...register('artist_id', { required: true })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
                <option value="">Seleccionar artista</option>
                {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Icono</label>
            <select {...register('icon_name')} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-foreground focus:outline-none">
              <option value="">Sin icono</option>
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Descripción</label>
          <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none resize-none" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-foreground px-8 py-3 text-sm text-background hover:bg-foreground/90 transition-colors">
            {editing ? 'Actualizar servicio' : 'Crear servicio'}
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
        <h3 className="font-heading text-2xl font-light">Servicios ({services.length})</h3>
        <button onClick={startCreate} className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
          + Nuevo servicio
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="img-shimmer h-20 rounded-lg" />)}
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-foreground/50 py-12">No hay servicios.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service._id} className="flex items-start justify-between rounded-lg border border-border p-5 hover:border-foreground/30 transition-colors">
              <div className="min-w-0 flex-1 pr-4">
                <p className="font-heading text-lg leading-tight">{service.title}</p>
                {service.icon_name && <p className="text-xs text-foreground/40 mt-0.5">Icono: {service.icon_name}</p>}
                {service.description && (
                  <p className="mt-2 text-sm text-foreground/50 leading-relaxed line-clamp-3">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(service)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteService(service._id)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-destructive">
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
