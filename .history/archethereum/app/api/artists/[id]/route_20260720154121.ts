import Artist from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
    const artist = isObjectId
      ? await Artist.findById(id).lean()
      : await Artist.findOne({ slug: id }).lean()
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
    const artist = await Artist.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true })
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
