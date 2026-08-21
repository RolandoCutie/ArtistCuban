import Artist from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    // admin=true bypasses is_active filter (for dashboard)
    const admin = searchParams.get('admin') === 'true'

    let query: Record<string, unknown> = {}
    if (!admin) query.is_active = true   // public API only shows active artists
    if (featured === 'true') query.is_featured = true
    if (search) {
      const regex = new RegExp(search, 'i')
      query = {
        ...query,
        $or: [
          { name: regex },
          { alias: regex },
          { specialty: regex },
          { categories: regex },
          { city: regex },
          { country: regex },
        ],
      }
    }

    // admin gets all fields; public gets only the fields needed for listing
    const projection = admin
      ? {}
      : { name: 1, alias: 1, slug: 1, specialty: 1, categories: 1, city: 1, country: 1, photo_url: 1, is_featured: 1, exhibitions_count: 1, template: 1 }

    const category = searchParams.get('category')
    if (category) {
      query.categories = { $regex: new RegExp(`^${category}$`, 'i') }
    }

    const limitParam = searchParams.get('limit')
    const pageParam = searchParams.get('page')
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 0
    const page = pageParam ? Math.max(parseInt(pageParam) - 1, 0) : 0

    let q = Artist.find(query, projection).sort({ created_date: -1 })
    if (limit) q = q.skip(page * limit).limit(limit)
    const artists = await q.lean()
    return NextResponse.json(artists)
  } catch {
    return NextResponse.json({ error: 'Error al obtener artistas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    // Auto-generate slug from name if not provided
    if (!body.slug && body.name) {
      const base = body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      // Ensure uniqueness
      const exists = await Artist.findOne({ slug: base })
      body.slug = exists ? `${base}-${Date.now()}` : base
    }
    const artist = await Artist.create(body)
    return NextResponse.json(artist, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear artista' }, { status: 500 })
  }
}
