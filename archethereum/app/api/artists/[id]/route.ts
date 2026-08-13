import Artist from '@/lib/models/Artist'
import connectDB from '@/lib/mongodb'
import { slugify } from '@/lib/slug'
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

    let artist = null

    if (isObjectId) {
      artist = await Artist.findById(id).lean()
    } else {
      // 1. Buscar por slug almacenado en BD
      artist = await Artist.findOne({ slug: id }).lean()

      // 2. Fallback: buscar todos y comparar slug generado desde nombre
      //    (cubre artistas creados antes de que se añadiera el campo slug)
      if (!artist) {
        const all = await Artist.find({}).select('name slug _id').lean()
        const match = all.find((a) => slugify(a.name) === id)
        if (match) {
          artist = await Artist.findById(match._id).lean()
        }
      }
    }

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
    // Asegura que el slug siempre exista (se regenera al cambiar el nombre)
    if (body.name) {
      body.slug = slugify(body.name)
    }
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
