import Event from '@/lib/models/Event'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const events = await Event.find().sort({ date: 1 }).lean()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const event = await Event.create(body)
    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 })
  }
}
