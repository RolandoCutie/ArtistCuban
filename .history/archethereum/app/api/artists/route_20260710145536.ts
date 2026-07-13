import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Artist from '@/lib/models/Artist'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    let query: Record<string, unknown> = {}
    if (featured === 'true') query.is_featured = true
    if (search) {
      const regex = new RegExp(search, 'i')
      query = {
        ...query,
        $or: [
          { name: regex },
          { alias: regex },
          { specialty: regex },
          { category: regex },
          { city: regex },
          { country: regex },
        ],
      }
    }

    const artists = await Artist.find(query).sort({ created_date: -1 }).lean()
    return NextResponse.json(artists)
  } catch {
    return NextResponse.json({ error: 'Error al obtener artistas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const artist = await Artist.create(body)
    return NextResponse.json(artist, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear artista' }, { status: 500 })
  }
}
