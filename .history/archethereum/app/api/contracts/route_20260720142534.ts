import Contract from '@/lib/models/Contract'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

function calcTotals(body: Record<string, unknown>) {
  const amount = Number(body.amount) || 0
  const discount = Number(body.discount) || 0
  const taxRate = body.tax_rate !== undefined ? Number(body.tax_rate) : 21
  const discounted = amount - discount
  const taxAmount = Math.round(discounted * (taxRate / 100) * 100) / 100
  const totalWithTax = Math.round((discounted + taxAmount) * 100) / 100
  return { tax_amount: taxAmount, total_with_tax: totalWithTax }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const artist_id = searchParams.get('artist_id')
    const status = searchParams.get('status')

    const query: Record<string, unknown> = {}
    if (artist_id) query.artist_id = artist_id
    if (status) query.status = status

    const contracts = await Contract.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(contracts)
  } catch {
    return NextResponse.json({ error: 'Error al obtener contratos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    const count = await Contract.countDocuments()
    const number = `AH-C-${String(count + 1).padStart(4, '0')}`
    const totals = calcTotals(body)

    const contract = await Contract.create({
      ...body,
      ...totals,
      number,
      version: 1,
      history: [{ date: new Date().toISOString(), action: 'Contrato creado', user: 'admin', version: 1 }],
    })
    return NextResponse.json(contract, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear contrato' }, { status: 500 })
  }
}
