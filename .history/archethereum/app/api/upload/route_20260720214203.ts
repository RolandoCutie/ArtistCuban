import { put } from '@vercel/blob'
import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

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

/** Save file to public/uploads/ and return the public URL */
async function saveLocally(file: File, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(uploadsDir, filename), buffer)
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${base}/uploads/${filename}`
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

    // Use Vercel Blob in production, local filesystem in development
    if (hasBlobToken()) {
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      return NextResponse.json({ url: blob.url })
    } else {
      const url = await saveLocally(file, filename)
      return NextResponse.json({ url })
    }
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
  }
}
