import Contract from '@/lib/models/Contract'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

function calcTotals(amount: number, taxRate: number, discount = 0) {
  const discounted = amount - discount
  const taxAmount = Math.round(discounted * (taxRate / 100) * 100) / 100
  const totalWithTax = Math.round((discounted + taxAmount) * 100) / 100
  return { tax_amount: taxAmount, total_with_tax: totalWithTax }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const contract = await Contract.findById(id).lean()
    if (!contract) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(contract)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const existing = await Contract.findById(id)
    if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const historyEntry: { date: string; action: string; user: string; note?: string; version?: number } = {
      date: new Date().toISOString(),
      action: '',
      user: 'admin',
    }

    // Track status change
    if (body.status && body.status !== existing.status) {
      historyEntry.action = `Estado cambiado de "${existing.status}" a "${body.status}"`
    } else {
      const newVersion = (existing.version || 1) + 1
      historyEntry.action = `Contrato actualizado (v${newVersion})`
      historyEntry.version = newVersion
      body.version = newVersion

      // Record revision
      existing.revisions.push({
        version: existing.version || 1,
        date: new Date().toISOString(),
        description: body._revisionNote || 'Actualización',
        author: 'admin',
      })
    }

    existing.history.push(historyEntry)

    // Recalculate totals if financial fields changed
    const amount = body.amount !== undefined ? Number(body.amount) : existing.amount
    const taxRate = body.tax_rate !== undefined ? Number(body.tax_rate) : (existing.tax_rate ?? 21)
    const discount = body.discount !== undefined ? Number(body.discount) : (existing.discount ?? 0)
    const { tax_amount, total_with_tax } = calcTotals(amount, taxRate, discount)
    body.tax_amount = tax_amount
    body.total_with_tax = total_with_tax

    // Remove internal helper field
    delete body._revisionNote

    Object.assign(existing, body)
    await existing.save()
    return NextResponse.json(existing)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Contract.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
