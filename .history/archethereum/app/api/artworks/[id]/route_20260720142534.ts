import Artwork from '@/lib/models/Artwork'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const artwork = await Artwork.findById(id).lean()
    if (!artwork) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(artwork)
  } catch {
    return NextResponse.json({ error: 'Error al obtener obra' }, { status: 500 })
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
    const artwork = await Artwork.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true })
    if (!artwork) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(artwork)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar obra' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    await Artwork.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar obra' }, { status: 500 })
  }
}
