import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Event from '@/lib/models/Event'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const event = await Event.findById(id).lean()
    if (!event) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Error al obtener evento' }, { status: 500 })
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
    const event = await Event.findByIdAndUpdate(id, body, { new: true })
    if (!event) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    await Event.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 })
  }
}
