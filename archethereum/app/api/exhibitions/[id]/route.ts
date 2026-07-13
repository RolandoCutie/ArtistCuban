import Exhibition from '@/lib/models/Exhibition'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const exhibition = await Exhibition.findById(id).lean()
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
    const exhibition = await Exhibition.findByIdAndUpdate(id, body, { new: true, runValidators: true })
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
