import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function uniqueFilename(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  return `${timestamp}-${random}.${ext}`
}

/** Returns true when a real Vercel Blob token is present */
function hasBlobToken(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  return token.length > 20 && !token.includes('_here') && !token.includes('your_')
}

/** Parse CLOUDINARY_URL and return credentials, or null if not set / invalid */
function parseCloudinaryUrl(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const url = process.env.CLOUDINARY_URL || ''
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/)
  if (!match) return null
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] }
}

/** Generate Cloudinary signed upload signature */
function cloudinarySign(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex')
}

/** Upload to Cloudinary using the REST API (no SDK needed) */
async function uploadToCloudinary(
  file: File,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'archethereum'
  const paramsToSign: Record<string, string> = { folder, timestamp }
  const signature = cloudinarySign(paramsToSign, apiSecret)

  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', apiKey)
  fd.append('timestamp', timestamp)
  fd.append('signature', signature)
  fd.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err.error?.message || `Cloudinary error ${res.status}`)
  }

  const data = await res.json() as { secure_url: string }
  return data.secure_url
}

/** Save file to public/uploads/ and return a relative URL (development fallback) */
async function saveLocally(file: File, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(uploadsDir, filename), buffer)
  return `/uploads/${filename}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WebP o AVIF.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El archivo supera el límite de 10 MB.' }, { status: 400 })
    }

    const filename = uniqueFilename(file.name)

    // Priority 1 — Vercel Blob (production, explicit token)
    if (hasBlobToken()) {
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      return NextResponse.json({ url: blob.url })
    }

    // Priority 2 — Cloudinary (works locally AND in production, no extra config)
    const cloudinary = parseCloudinaryUrl()
    if (cloudinary) {
      const url = await uploadToCloudinary(
        file,
        cloudinary.cloudName,
        cloudinary.apiKey,
        cloudinary.apiSecret
      )
      return NextResponse.json({ url })
    }

    // Priority 3 — Local filesystem (dev fallback, no cloud credentials)
    const url = await saveLocally(file, filename)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
