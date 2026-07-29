'use client'

import {
  Award,
  BookOpen,
  Brush,
  Building2,
  Camera,
  ChevronDown,
  Compass,
  Crown,
  Drama,
  Feather,
  Film,
  Gem,
  GraduationCap,
  Heart,
  Image,
  Layers,
  Lightbulb,
  LucideIcon,
  Music,
  Palette,
  PenTool,
  Search,
  Sparkles,
  Star,
  Theater,
  Trophy,
  Wand2,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface IconEntry {
  name: string
  label: string
  category: string
  Icon: LucideIcon
}

const ALL_ICONS: IconEntry[] = [
  // Arte
  { name: 'Palette', label: 'Paleta', category: 'Arte', Icon: Palette },
  { name: 'Brush', label: 'Pincel', category: 'Arte', Icon: Brush },
  { name: 'PenTool', label: 'Pluma', category: 'Arte', Icon: PenTool },
  { name: 'Feather', label: 'Pluma ligera', category: 'Arte', Icon: Feather },
  { name: 'Image', label: 'Imagen', category: 'Arte', Icon: Image },
  { name: 'Layers', label: 'Capas', category: 'Arte', Icon: Layers },
  { name: 'Wand2', label: 'Varita', category: 'Arte', Icon: Wand2 },
  // Fotografía
  { name: 'Camera', label: 'Cámara', category: 'Fotografía', Icon: Camera },
  { name: 'Film', label: 'Cine', category: 'Fotografía', Icon: Film },
  // Educación
  { name: 'GraduationCap', label: 'Graduación', category: 'Educación', Icon: GraduationCap },
  { name: 'BookOpen', label: 'Libro', category: 'Educación', Icon: BookOpen },
  { name: 'Compass', label: 'Brújula', category: 'Educación', Icon: Compass },
  // Música & Escena
  { name: 'Music', label: 'Música', category: 'Música', Icon: Music },
  { name: 'Drama', label: 'Drama', category: 'Música', Icon: Drama },
  { name: 'Theater', label: 'Teatro', category: 'Música', Icon: Theater },
  // Museos & Cultura
  { name: 'Building2', label: 'Museo', category: 'Museos', Icon: Building2 },
  { name: 'Gem', label: 'Joya', category: 'Museos', Icon: Gem },
  { name: 'Crown', label: 'Corona', category: 'Museos', Icon: Crown },
  // Premios & Reconocimiento
  { name: 'Award', label: 'Premio', category: 'Reconocimiento', Icon: Award },
  { name: 'Trophy', label: 'Trofeo', category: 'Reconocimiento', Icon: Trophy },
  { name: 'Star', label: 'Estrella', category: 'Reconocimiento', Icon: Star },
  // General
  { name: 'Sparkles', label: 'Destellos', category: 'General', Icon: Sparkles },
  { name: 'Lightbulb', label: 'Idea', category: 'General', Icon: Lightbulb },
  { name: 'Heart', label: 'Corazón', category: 'General', Icon: Heart },
  { name: 'Zap', label: 'Rayo', category: 'General', Icon: Zap },
]

const CATEGORIES = ['Todos', ...Array.from(new Set(ALL_ICONS.map((i) => i.category)))]

interface IconPickerProps {
  value?: string
  onChange: (name: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = ALL_ICONS.find((i) => i.name === value)

  const filtered = useMemo(() => {
    return ALL_ICONS.filter((icon) => {
      const matchesCategory = activeCategory === 'Todos' || icon.category === activeCategory
      const matchesSearch =
        !search ||
        icon.label.toLowerCase().includes(search.toLowerCase()) ||
        icon.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (name: string) => {
    onChange(name)
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm hover:border-foreground/50 transition-colors"
      >
        {selected ? (
          <>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground/8 text-foreground">
              <selected.Icon size={16} />
            </span>
            <span className="flex-1 text-left">
              <span className="font-medium">{selected.label}</span>
              <span className="ml-2 text-xs text-foreground/40">{selected.category}</span>
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground/30">
              <Sparkles size={14} />
            </span>
            <span className="flex-1 text-left text-foreground/50">Seleccionar icono</span>
            <ChevronDown size={14} className={`text-foreground/40 transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[320px] rounded-xl border border-border bg-background shadow-xl">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search size={14} className="shrink-0 text-foreground/40" />
            <input
              type="text"
              placeholder="Buscar icono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/30"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                  activeCategory === cat
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-foreground/60 hover:bg-foreground/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Icon grid */}
          <div className="max-h-64 overflow-y-auto p-3">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground/40">Sin resultados</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                {filtered.map(({ name, label, category, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelect(name)}
                    title={`${label} · ${category}`}
                    className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-colors hover:bg-muted ${
                      value === name ? 'bg-foreground/8 ring-1 ring-foreground/20' : ''
                    }`}
                  >
                    <Icon size={18} className={value === name ? 'text-foreground' : 'text-foreground/70'} />
                    <span className="max-w-full truncate text-[10px] text-foreground/50">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
