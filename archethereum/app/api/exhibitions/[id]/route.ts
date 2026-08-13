import Exhibition from '@/lib/models/Exhibition'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

async function findExhibition(id: string) {
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24
  if (isObjectId) {
    const doc = await Exhibition.findById(id).lean()
    if (doc) return doc
  }
  // Fallback: lookup by slug
  return Exhibition.findOne({ slug: id }).lean()
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const exhibition = await findExhibition(id)
    if (!exhibition) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(exhibition)
  } catch {
    return NextResponse.json({ error: 'Error al obtener exposición' }, { status: 500 })
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
    const exhibition = await Exhibition.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true })
    if (!exhibition) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(exhibition)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar exposición' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    await Exhibition.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar exposición' }, { status: 500 })
  }
}
