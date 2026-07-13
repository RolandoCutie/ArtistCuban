import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const artistId = searchParams.get('artist_id')
    const query: Record<string, unknown> = {}
    if (artistId) query.artist_id = artistId
    const services = await Service.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const service = await Service.create(body)
    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}
