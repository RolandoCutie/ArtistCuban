import Subscription from '@/lib/models/Subscription'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const artist_id = searchParams.get('artist_id')
    const status = searchParams.get('status')

    const query: Record<string, unknown> = {}
    if (artist_id) query.artist_id = artist_id
    if (status) query.status = status

    const subscriptions = await Subscription.find(query).sort({ end_date: 1 }).lean()
    return NextResponse.json(subscriptions)
  } catch {
    return NextResponse.json({ error: 'Error al obtener suscripciones' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const subscription = await Subscription.create(body)
    return NextResponse.json(subscription, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear suscripción' }, { status: 500 })
  }
}
