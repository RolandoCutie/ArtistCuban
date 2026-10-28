'use client'

import { allSpecialties } from '@/lib/categories'
import { slugify } from '@/lib/slug'
import { TEMPLATES, type TemplateConfig } from '@/lib/templates'
import { ExternalLink, Pencil, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ArtworkManager from './ArtworkManager'
import ExhibitionManager from './ExhibitionManager'
import ImageUpload from './ImageUpload'
import ServiceManager from './ServiceManager'

interface Artist {
  _id: string
  slug?: string
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
  is_active?: boolean
  template?: string
  inspiring_quote?: string
  social_links?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    behance?: string
    linkedin?: string
    pinterest?: string
    twitter?: string
    website?: string
  }
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

function TemplatePreview({ template, selected }: { template: TemplateConfig; selected: boolean }) {
  const textColor = template.preview_text ?? '#888888'
  const accentColor = template.preview_accent ?? '#888888'
  const softText = `${textColor}22`
  const softAccent = `${accentColor}22`

  const bar = (width: string, height: string, background: string, opacity = 1) => (
    <div className="rounded-full" style={{ width, height, background, opacity }} />
  )

  const previewContent = () => {
    switch (template.previewStyle) {
      case 'editorial':
        return (
          <>
            <div className="absolute left-4 top-14 h-20 w-16 rounded-[1.35rem]" style={{ background: `linear-gradient(180deg, ${softAccent}, ${softText})` }} />
            <div className="absolute left-24 top-16 right-5 space-y-2.5">
              {bar('72%', '0.9rem', textColor, 0.86)}
              {bar('52%', '0.45rem', textColor, 0.26)}
            </div>
            <div className="absolute bottom-5 right-5 grid w-28 grid-cols-2 gap-2">
              <div className="h-10 rounded-2xl" style={{ background: softText }} />
              <div className="h-14 rounded-[1.2rem]" style={{ background: softAccent }} />
            </div>
          </>
        )
      case 'luxury':
        return (
          <>
            <div className="absolute left-5 right-5 top-14 rounded-[1.4rem] border px-4 py-5" style={{ borderColor: `${accentColor}55`, background: 'rgba(255,255,255,0.7)' }}>
              {bar('62%', '0.8rem', textColor, 0.94)}
              <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
              <div className="mt-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border" style={{ borderColor: `${accentColor}66` }} />
                {bar('34%', '0.42rem', accentColor, 0.66)}
              </div>
            </div>
          </>
        )
      case 'cinematic':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff22,transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
            <div className="absolute left-4 right-10 top-16 space-y-3">
              {bar('84%', '1rem', textColor, 0.95)}
              {bar('64%', '1rem', textColor, 0.95)}
            </div>
            <div className="absolute bottom-5 left-4 right-4 flex gap-2">
              {[0.9, 0.7, 0.45].map((opacity, index) => (
                <div key={index} className="h-8 flex-1 rounded-2xl" style={{ background: accentColor, opacity }} />
              ))}
            </div>
          </>
        )
      case 'museum':
        return (
          <>
            <div className="absolute left-5 right-5 top-14 rounded-[1.2rem] border p-3" style={{ borderColor: `${textColor}25`, background: 'rgba(255,255,255,0.32)' }}>
              <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
                <div className="h-20 rounded-[1rem] border" style={{ borderColor: `${accentColor}55`, background: softText }} />
                <div className="space-y-2 pt-1">
                  {bar('100%', '0.5rem', textColor, 0.8)}
                  {bar('76%', '0.42rem', textColor, 0.28)}
                  <div className="mt-4 rounded-xl px-2 py-2" style={{ background: softAccent }}>
                    {bar('88%', '0.38rem', accentColor, 0.7)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 'modern':
        return (
          <>
            <div className="absolute -right-6 top-12 h-24 w-24 rounded-full blur-2xl" style={{ background: `${accentColor}55` }} />
            <div className="absolute left-4 right-4 top-14 grid grid-cols-[1.1fr_0.9fr] gap-2">
              <div className="space-y-2 rounded-[1.4rem] bg-white/75 p-3 shadow-sm">
                {bar('78%', '0.82rem', textColor, 0.9)}
                {bar('52%', '0.42rem', textColor, 0.32)}
                <div className="flex gap-2 pt-1">
                  <div className="h-8 flex-1 rounded-2xl" style={{ background: softAccent }} />
                  <div className="h-8 w-10 rounded-2xl" style={{ background: softText }} />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="h-11 rounded-[1.15rem]" style={{ background: softAccent }} />
                <div className="h-15 rounded-[1.6rem] bg-white/65" />
              </div>
            </div>
          </>
        )
      case 'glass':
        return (
          <>
            <div className="absolute left-6 top-14 h-16 w-16 rounded-full blur-2xl" style={{ background: `${accentColor}44` }} />
            <div className="absolute bottom-6 right-6 h-20 w-20 rounded-full blur-3xl" style={{ background: `${textColor}22` }} />
            <div className="absolute left-4 right-4 top-16 space-y-3">
              <div className="rounded-[1.35rem] border px-4 py-3 backdrop-blur-xl" style={{ borderColor: `${textColor}18`, background: 'rgba(255,255,255,0.08)' }}>
                {bar('60%', '0.7rem', textColor, 0.84)}
                {bar('90%', '0.42rem', textColor, 0.22)}
              </div>
              <div className="ml-auto w-[72%] rounded-[1.35rem] border px-4 py-4 backdrop-blur-xl" style={{ borderColor: `${accentColor}22`, background: 'rgba(255,255,255,0.05)' }}>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 rounded-2xl" style={{ background: softAccent }} />
                  <div className="h-10 w-10 rounded-2xl" style={{ background: softText }} />
                </div>
              </div>
            </div>
          </>
        )
      case 'minimal':
        return (
          <>
            <div className="absolute left-5 right-5 top-14">
              <div className="flex items-end justify-between">
                <div>
                  {bar('8rem', '0.82rem', textColor, 0.94)}
                  <div className="mt-5 h-px w-24" style={{ background: `${textColor}33` }} />
                </div>
                <p className="text-[2.8rem] font-light leading-none" style={{ color: `${textColor}14` }}>01</p>
              </div>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex gap-2">
              <div className="h-11 flex-1 border" style={{ borderColor: `${textColor}16` }} />
              <div className="h-11 w-14 border" style={{ borderColor: `${textColor}16` }} />
            </div>
          </>
        )
      case 'immersive':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(58,156,80,0.22),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_22%)]" />
            <div className="absolute left-5 right-5 top-14 rounded-[1.6rem] border p-3" style={{ borderColor: `${accentColor}35`, background: 'rgba(15,26,20,0.64)' }}>
              <div className="h-14 rounded-[1.2rem]" style={{ background: `linear-gradient(135deg, ${softAccent}, ${softText})` }} />
              <div className="mt-3 flex items-center justify-between">
                {bar('42%', '0.45rem', textColor, 0.9)}
                <div className="h-6 w-6 rounded-full" style={{ background: accentColor }} />
              </div>
            </div>
          </>
        )
      case 'organic':
        return (
          <>
            <div className="absolute left-4 top-14 h-14 w-14 rounded-full blur-xl" style={{ background: `${accentColor}44` }} />
            <div className="absolute right-8 top-16 h-12 w-12 rounded-full blur-lg" style={{ background: `${textColor}18` }} />
            <div className="absolute left-5 right-5 top-16 flex items-center gap-3">
              <div className="h-16 w-16 rounded-full border-4" style={{ borderColor: `${accentColor}44`, background: softText }} />
              <div className="flex-1 space-y-2">
                {bar('74%', '0.82rem', textColor, 0.86)}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[accentColor, textColor, accentColor].map((background, index) => (
                    <div key={index} className="h-5 rounded-full" style={{ width: index === 1 ? '2.4rem' : '3rem', background, opacity: index === 1 ? 0.18 : 0.48 }} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      case 'brutal':
        return (
          <>
            <div className="absolute left-4 top-14 h-14 w-20 -rotate-2 border-[3px]" style={{ borderColor: textColor, background: `${accentColor}55` }} />
            <div className="absolute right-4 top-18 h-16 w-24 rotate-2 border-[3px] bg-white/55" style={{ borderColor: textColor }} />
            <div className="absolute bottom-5 left-4 right-4 space-y-2">
              {bar('78%', '0.95rem', textColor, 1)}
              <div className="flex gap-2">
                <div className="h-5 w-16 border-2" style={{ borderColor: textColor, background: accentColor }} />
                <div className="h-5 flex-1 border-2" style={{ borderColor: textColor }} />
              </div>
            </div>
          </>
        )
      case 'atlas':
        return (
          <>
            <div className="absolute left-4 right-4 top-14 grid grid-cols-[0.75fr_1.25fr] gap-2">
              <div className="rounded-[1.1rem] border bg-white/70 p-2" style={{ borderColor: `${textColor}22` }}>
                <div className="h-9 rounded-lg" style={{ background: softText }} />
                <div className="mt-2 h-8 rounded-lg" style={{ background: softAccent }} />
              </div>
              <div className="space-y-2 rounded-[1.2rem] border bg-white/66 p-3" style={{ borderColor: `${accentColor}2a` }}>
                {bar('76%', '0.74rem', textColor, 0.9)}
                {bar('54%', '0.4rem', textColor, 0.3)}
                <div className="flex gap-2 pt-1">
                  <div className="h-7 flex-1 rounded-xl" style={{ background: softAccent }} />
                  <div className="h-7 w-10 rounded-xl" style={{ background: softText }} />
                </div>
              </div>
            </div>
          </>
        )
      case 'runway':
        return (
          <>
            <div className="absolute inset-x-0 top-14 h-7 border-y" style={{ borderColor: `${textColor}22`, background: `${textColor}08` }} />
            <div className="absolute left-4 right-4 top-24 flex gap-2">
              {[0.95, 0.75, 0.55].map((opacity, index) => (
                <div key={index} className="h-16 flex-1 rounded-[1rem] border" style={{ borderColor: `${accentColor}48`, background: `${accentColor}20`, opacity }} />
              ))}
            </div>
            <div className="absolute bottom-5 left-4 right-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full" style={{ background: accentColor }} />
              {bar('62%', '0.45rem', textColor, 0.82)}
            </div>
          </>
        )
      case 'prisma':
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(195,107,255,0.26),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(123,205,255,0.26),transparent_34%)]" />
            <div className="absolute left-4 right-4 top-14 grid grid-cols-2 gap-2">
              <div className="rounded-[1.1rem] border bg-white/16 p-2 backdrop-blur-md" style={{ borderColor: `${accentColor}44` }}>
                {bar('80%', '0.72rem', textColor, 0.92)}
                {bar('56%', '0.4rem', textColor, 0.32)}
              </div>
              <div className="grid gap-2">
                <div className="h-10 rounded-[0.9rem]" style={{ background: `${accentColor}4f` }} />
                <div className="h-10 rounded-[0.9rem]" style={{ background: `${textColor}22` }} />
              </div>
            </div>
          </>
        )
      case 'zen':
        return (
          <>
            <div className="absolute left-9 top-14 h-20 w-px" style={{ background: `${textColor}25` }} />
            <div className="absolute left-14 right-6 top-[3.75rem] space-y-2">
              {bar('58%', '0.75rem', textColor, 0.88)}
              {bar('42%', '0.4rem', textColor, 0.26)}
              <div className="mt-5 h-px w-20" style={{ background: `${accentColor}45` }} />
            </div>
            <div className="absolute bottom-6 left-14 right-6 flex gap-2">
              <div className="h-8 w-14 border" style={{ borderColor: `${textColor}24` }} />
              <div className="h-8 flex-1 border" style={{ borderColor: `${textColor}24` }} />
            </div>
          </>
        )
      case 'ledger':
        return (
          <>
            <div className="absolute left-4 right-4 top-14 border-2 px-3 py-2" style={{ borderColor: `${textColor}2f` }}>
              <div className="grid grid-cols-[0.8fr_1.2fr] gap-2">
                <div className="space-y-2">
                  {bar('100%', '0.36rem', textColor, 0.28)}
                  {bar('82%', '0.36rem', textColor, 0.22)}
                </div>
                <div className="space-y-2">
                  {bar('90%', '0.36rem', textColor, 0.78)}
                  {bar('66%', '0.36rem', textColor, 0.35)}
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, ${textColor}20, ${accentColor}, ${textColor}20)` }} />
          </>
        )
      default:
        return (
          <div className="absolute left-4 right-4 top-16 space-y-3">
            {bar('62%', '0.85rem', textColor, 0.88)}
            {bar('38%', '0.45rem', textColor, 0.3)}
          </div>
        )
    }
  }

  return (
    <div className={`relative h-44 overflow-hidden ${template.preview_bg}`}>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
        <span
          className="rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.28em]"
          style={{ borderColor: `${textColor}24`, color: textColor, background: `${textColor}10` }}
        >
          {template.layoutStyle}
        </span>
        {selected && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-2 text-[10px] font-semibold text-background shadow-lg">
            Activa
          </span>
        )}
      </div>
      {previewContent()}
      <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${textColor})` }} />
    </div>
  )
}

export default function ArtistManager() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Artist | null>(null)
  const [creating, setCreating] = useState(false)
  const [editTab, setEditTab] = useState('profile')
  const [photoUrl, setPhotoUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('template1')
  const [compareTemplates, setCompareTemplates] = useState<string[]>(['template1'])
  const [inlinePreviewExpanded, setInlinePreviewExpanded] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})
  const [sections, setSections] = useState({
    bio: true, artworks: true, exhibitions: true, services: true,
    social: true, contact: true, gallery: false, awards: false,
    influences: false, education: false,
  })

  const { register, handleSubmit, reset, watch } = useForm<FormData>()
  const watchedName = watch('name')

  const fetchArtists = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/artists?admin=true')
      setArtists(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchArtists() }, [fetchArtists])

  useEffect(() => {
    setCompareTemplates((prev) => {
      if (prev.includes(selectedTemplate)) return prev
      return [selectedTemplate, ...prev].slice(0, 3)
    })
  }, [selectedTemplate])

  const toggleCompareTemplate = (templateId: string) => {
    setCompareTemplates((prev) => {
      if (prev.includes(templateId)) {
        if (prev.length === 1) return prev
        return prev.filter((id) => id !== templateId)
      }

      if (prev.length >= 3) {
        return [...prev.slice(0, 2), templateId]
      }

      return [...prev, templateId]
    })
  }

  const startEdit = (artist: Artist) => {
    setEditing(artist)
    setCreating(false)
    setEditTab('profile')
    setPhotoUrl(artist.photo_url || '')
    setCoverUrl(artist.cover_url || '')
    setSelectedCategories(artist.categories || [])
    setSelectedTemplate(artist.template || 'template1')
    setCompareTemplates([artist.template || 'template1'])
    setInlinePreviewExpanded(true)
    setIsActive(artist.is_active !== false)
    setSocialLinks((artist.social_links as Record<string, string>) || {})
    setSections({ bio: true, artworks: true, exhibitions: true, services: true, social: true, contact: true, gallery: false, awards: false, influences: false, education: false, ...(artist as {sections?: Record<string, boolean>}).sections })
    reset({
      name: artist.name,
      alias: artist.alias,
      specialty: artist.specialty,
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
    setSelectedTemplate('template1')
    setCompareTemplates(['template1'])
    setInlinePreviewExpanded(true)
    setIsActive(true)
    setSocialLinks({})
    setSections({ bio: true, artworks: true, exhibitions: true, services: true, social: true, contact: true, gallery: false, awards: false, influences: false, education: false })
    reset({})
  }

  const cancel = () => { setEditing(null); setCreating(false) }

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      categories: selectedCategories,
      template: selectedTemplate,
      is_active: isActive,
      social_links: socialLinks,
      sections,
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
    const previewName = (watchedName || editing?.name || '').trim() || editing?.name || ''
    const previewSlug = editing ? editing.slug || slugify(previewName) : ''

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
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs uppercase tracking-widest text-foreground/40">
                  Categorías <span className="text-foreground/25">(selecciona una o varias)</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        selectedCategories.includes(cat)
                          ? 'border-foreground bg-foreground/5 text-foreground'
                          : 'border-border text-foreground/50 hover:border-foreground/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 shrink-0 accent-foreground"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          setSelectedCategories((prev) =>
                            e.target.checked ? [...prev, cat] : prev.filter((c) => c !== cat)
                          )
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
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

          {/* Featured + activo */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input {...register('is_featured')} type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" />
              <span className="text-sm">Artista destacado</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground"
              />
              <span className="text-sm">Perfil activo (visible en el sitio)</span>
            </label>
          </div>

          {/* Plantilla */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl">Plantilla del perfil</h3>
                <p className="mt-1 max-w-3xl text-xs text-foreground/40">
                  Elige una plantilla que venda la identidad del artista desde el primer vistazo. Cada opción tiene una promesa visual distinta para ayudarte a cerrar perfiles con más impacto.
                </p>
              </div>
              {editing && (
                <Link
                  href={{
                    pathname: `/artista/${editing.slug || slugify(editing.name)}`,
                    query: { previewTemplate: selectedTemplate },
                  }}
                  target="_blank"
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-all hover:border-foreground hover:shadow-sm"
                >
                  <ExternalLink size={12} /> Previsualizar (sin guardar)
                </Link>
              )}
            </div>
            <div className="mb-5 rounded-[1.5rem] border border-border bg-muted/30 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/45">Catálogo premium</p>
                  <p className="mt-1 max-w-2xl text-sm text-foreground/65">
                    No son solo colores: aquí estás eligiendo el posicionamiento comercial del artista, desde lujo silencioso hasta impacto brutalista.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                  <span className="rounded-full border border-border bg-background px-3 py-1.5">Más contraste</span>
                  <span className="rounded-full border border-border bg-background px-3 py-1.5">Más valor percibido</span>
                  <span className="rounded-full border border-border bg-background px-3 py-1.5">Más diferenciación</span>
                </div>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {TEMPLATES.map((t) => {
                const isSelected = selectedTemplate === t.id
                const isCompared = compareTemplates.includes(t.id)

                return (
                  <div
                    key={t.id}
                    className={`overflow-hidden rounded-[1.6rem] border transition-all duration-300 ${
                      isSelected
                        ? 'border-foreground bg-background shadow-[0_24px_80px_-32px_rgba(0,0,0,0.35)] -translate-y-0.5'
                        : 'border-border bg-background/80 hover:-translate-y-1 hover:border-foreground/40 hover:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.35)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(t.id)}
                      className="group block w-full text-left"
                    >
                      <TemplatePreview template={t} selected={isSelected} />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold leading-tight">{t.name}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-foreground/45">{t.marketTag}</p>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] ${isSelected ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/45'}`}>
                            {isSelected ? 'Seleccionada' : 'Disponible'}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-foreground/72">
                          {t.description}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-foreground/42">
                          Ideal para {t.idealFor}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {t.highlights.map((highlight) => (
                            <span key={highlight} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleCompareTemplate(t.id)}
                        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                          isCompared
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border text-foreground/55 hover:border-foreground hover:text-foreground'
                        }`}
                      >
                        {isCompared ? 'En comparativa' : 'Comparar'}
                      </button>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                        Max 3 vistas
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {editing && (
              <div className="mt-8 rounded-[1.5rem] border border-border bg-muted/20 p-4 lg:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/45">Previsualizador inline</p>
                    <p className="mt-1 text-sm text-foreground/65">
                      Compara hasta 3 plantillas lado a lado sin guardar cambios.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInlinePreviewExpanded((prev) => !prev)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-colors hover:border-foreground"
                  >
                    {inlinePreviewExpanded ? 'Ocultar comparativa' : 'Mostrar comparativa'}
                  </button>
                </div>

                {inlinePreviewExpanded && (
                  <>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {compareTemplates.map((templateId) => {
                        const template = TEMPLATES.find((tpl) => tpl.id === templateId)
                        if (!template) return null

                        return (
                          <button
                            key={templateId}
                            type="button"
                            onClick={() => setSelectedTemplate(templateId)}
                            className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                              selectedTemplate === templateId
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-background text-foreground/60 hover:border-foreground hover:text-foreground'
                            }`}
                          >
                            {template.name}
                          </button>
                        )
                      })}
                    </div>

                    <div className={`mt-5 grid gap-4 ${compareTemplates.length === 1 ? 'xl:grid-cols-1' : compareTemplates.length === 2 ? 'xl:grid-cols-2' : 'xl:grid-cols-3'}`}>
                      {previewSlug ? (
                        compareTemplates.map((templateId) => {
                          const template = TEMPLATES.find((tpl) => tpl.id === templateId)
                          if (!template) return null

                          const iframeSrc = `/artista/${previewSlug}?previewTemplate=${encodeURIComponent(templateId)}&embeddedPreview=1`

                          return (
                            <div key={templateId} className="overflow-hidden rounded-2xl border border-border bg-background">
                              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">{template.name}</p>
                                <button
                                  type="button"
                                  onClick={() => setSelectedTemplate(templateId)}
                                  className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                    selectedTemplate === templateId
                                      ? 'border-foreground bg-foreground text-background'
                                      : 'border-border text-foreground/55 hover:border-foreground hover:text-foreground'
                                  }`}
                                >
                                  {selectedTemplate === templateId ? 'Activa' : 'Usar esta'}
                                </button>
                              </div>
                              <iframe
                                title={`Preview ${template.name}`}
                                src={iframeSrc}
                                className="h-[640px] w-full"
                                loading="lazy"
                              />
                            </div>
                          )
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-foreground/50">
                          No se pudo construir el enlace de previsualización. Completa o corrige el nombre del artista.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Secciones del perfil */}
          <div>
            <h3 className="font-heading text-xl mb-1">Secciones del perfil</h3>
            <p className="mb-4 text-xs text-foreground/40">Activa o desactiva las secciones que aparecerán en el perfil público del artista.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => {
                const labels: Record<string, string> = {
                  bio: 'Biografía', artworks: 'Obras', exhibitions: 'Exposiciones',
                  services: 'Servicios', social: 'Redes Sociales', contact: 'Contacto',
                  gallery: 'Galería', awards: 'Premios', influences: 'Influencias', education: 'Educación',
                }
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                      sections[key] ? 'border-foreground bg-foreground/5' : 'border-border'
                    }`}
                  >
                    <span className="text-sm">{labels[key]}</span>
                    <div
                      onClick={() => setSections((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${sections[key] ? 'bg-foreground' : 'bg-border'}`}
                    >
                      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${sections[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-heading text-xl mb-4">Redes sociales</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(['instagram', 'facebook', 'tiktok', 'youtube', 'behance', 'linkedin', 'pinterest', 'twitter', 'website'] as const).map((network) => (
                <div key={network}>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40 capitalize">{network}</label>
                  <input
                    value={socialLinks[network] || ''}
                    onChange={(e) => setSocialLinks((prev) => ({ ...prev, [network]: e.target.value }))}
                    placeholder={network === 'website' ? 'https://...' : `@usuario o URL`}
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

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
                {artist.categories && artist.categories.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {artist.categories.map((cat) => (
                      <span key={cat} className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-foreground/40">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/artista/${artist.slug || slugify(artist.name)}`}
                  target="_blank"
                  title="Ver perfil público"
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground/50"
                >
                  <ExternalLink size={13} />
                </Link>
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
