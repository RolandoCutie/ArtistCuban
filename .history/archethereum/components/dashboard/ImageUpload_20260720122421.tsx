'use client'

import { CheckCircle2, ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  aspect?: string
  label?: string
}

export default function ImageUpload({
  value,
  onChange,
  aspect = 'h-32',
  label = 'Subir imagen',
}: ImageUploadProps) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Formato no permitido. Usa JPG, PNG, WebP o AVIF.`
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `El archivo supera el límite de ${MAX_SIZE_MB} MB.`
    }
    return null
  }

  const handleUpload = useCallback(
    (file: File) => {
      const validationError = validate(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setUploading(true)
      setDone(false)
      setError('')
      setProgress(0)

      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload')

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) {
            onChange(data.url)
            setDone(true)
            setTimeout(() => setDone(false), 2000)
          } else {
            setError(data.error || 'Error al subir imagen')
          }
        } catch {
          setError('Respuesta inválida del servidor')
        } finally {
          setUploading(false)
          setProgress(0)
        }
      }

      xhr.onerror = () => {
        setError('Error de red al subir imagen')
        setUploading(false)
        setProgress(0)
      }

      xhr.send(formData)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleUpload(file)
    },
    [handleUpload]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleUpload(file)
      // reset input so same file can be re-selected
      e.target.value = ''
    },
    [handleUpload]
  )

  if (value) {
    return (
      <div className="relative inline-block w-full">
        <div className={`${aspect} overflow-hidden rounded-lg border border-border`}>
          <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
        </div>
        <button
          type="button"
          onClick={() => { onChange(''); setError('') }}
          title="Eliminar imagen"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <label
        className={`relative flex ${aspect} cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors
          ${dragOver ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/50'}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          onChange={handleChange}
          className="sr-only"
          disabled={uploading}
        />

        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-foreground/50" />
            <span className="text-xs text-foreground/50">Subiendo... {progress}%</span>
            {/* Barra de progreso */}
            <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg bg-border">
              <div
                className="h-full bg-foreground/60 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : done ? (
          <>
            <CheckCircle2 size={22} className="text-green-500" />
            <span className="text-xs text-green-600">¡Subida completa!</span>
          </>
        ) : (
          <>
            {dragOver ? (
              <ImageIcon size={22} className="text-foreground/70" />
            ) : (
              <Upload size={22} className="text-foreground/40" />
            )}
            <span className="text-xs text-foreground/40 text-center px-2">
              {dragOver ? 'Suelta aquí' : label}
            </span>
            <span className="text-[10px] text-foreground/30">
              JPG, PNG, WebP, AVIF · máx. {MAX_SIZE_MB} MB
            </span>
          </>
        )}
      </label>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  )
}
