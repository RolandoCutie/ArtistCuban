import Subscription from '@/lib/models/Subscription'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

/** Auto-expire subscriptions whose end_date has passed and are still active/pending */
async function autoExpire() {
  const today = new Date().toISOString().slice(0, 10)
  await Subscription.updateMany(
    { end_date: { $lt: today }, status: { $in: ['active', 'pending'] } },
    { $set: { status: 'expired' } }
  )
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    await autoExpire()

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
