import Artist from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const artist = await Artist.findById(id).lean()
    if (!artist) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(artist)
  } catch {
    return NextResponse.json({ error: 'Error al obtener artista' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const artist = await Artist.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!artist) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(artist)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar artista' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    await Artist.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar artista' }, { status: 500 })
  }
}
