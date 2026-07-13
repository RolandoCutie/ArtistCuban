'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  aspect?: string
  label?: string
}

export default function ImageUpload({ value, onChange, aspect = 'h-32', label = 'Subir imagen' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  if (value) {
    return (
      <div className="relative">
        <div className={`${aspect} overflow-hidden rounded-lg border border-border`}>
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <label
        className={`relative flex ${aspect} cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border hover:border-foreground transition-colors`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
          className="sr-only"
          disabled={uploading}
        />
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-foreground/40" />
        ) : (
          <Upload size={20} className="text-foreground/40" />
        )}
        <span className="text-xs text-foreground/40">{uploading ? 'Subiendo...' : label}</span>
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
