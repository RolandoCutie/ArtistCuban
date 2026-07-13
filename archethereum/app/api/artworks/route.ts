import Artwork from '@/lib/models/Artwork'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const artistId = searchParams.get('artist_id')

    const query: Record<string, unknown> = {}
    if (artistId) query.artist_id = artistId

    const artworks = await Artwork.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(artworks)
  } catch {
    return NextResponse.json({ error: 'Error al obtener obras' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const artwork = await Artwork.create(body)
    return NextResponse.json(artwork, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear obra' }, { status: 500 })
  }
}
