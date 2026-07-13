import Exhibition from '@/lib/models/Exhibition'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const exhibitions = await Exhibition.find().sort({ date: -1 }).lean()
    return NextResponse.json(exhibitions)
  } catch {
    return NextResponse.json({ error: 'Error al obtener exposiciones' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const exhibition = await Exhibition.create(body)
    return NextResponse.json(exhibition, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear exposición' }, { status: 500 })
  }
}
