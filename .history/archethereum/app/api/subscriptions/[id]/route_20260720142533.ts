import Subscription from '@/lib/models/Subscription'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const sub = await Subscription.findById(id).lean()
    if (!sub) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(sub)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const sub = await Subscription.findByIdAndUpdate(id, body, { returnDocument: 'after' })
    if (!sub) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(sub)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Subscription.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
