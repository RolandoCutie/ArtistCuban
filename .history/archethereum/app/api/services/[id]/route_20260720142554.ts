import Service from '@/lib/models/Service'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const service = await Service.findById(id).lean()
    if (!service) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(service)
  } catch {
    return NextResponse.json({ error: 'Error al obtener servicio' }, { status: 500 })
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
    const service = await Service.findByIdAndUpdate(id, body, { returnDocument: 'after' })
    if (!service) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(service)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    await Service.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 })
  }
}
