import Artist from '@/lib/models/Artist'
import Artwork from '@/lib/models/Artwork'
import Contract from '@/lib/models/Contract'
import Exhibition from '@/lib/models/Exhibition'
import Invoice from '@/lib/models/Invoice'
import Subscription from '@/lib/models/Subscription'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const now = new Date()
    const year = parseInt(searchParams.get('year') || String(now.getFullYear()), 10)

    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const nowStr = now.toISOString().split('T')[0]
    const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0]

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0]
    const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0]

    const [
      totalArtists,
      activeArtists,
      hiddenArtists,
      featuredArtists,
      expiredSubs,
      expiringSoonSubs,
      activeContracts,
      expiredContracts,
      pendingInvoices,
      paidInvoices,
      monthlyInvoices,
      allPaidInvoices,
      yearInvoices,
      yearContracts,
      yearArtists,
      yearArtworks,
      yearExhibitions,
    ] = await Promise.all([
      Artist.countDocuments(),
      Artist.countDocuments({ is_active: true }),
      Artist.countDocuments({ is_active: false }),
      Artist.countDocuments({ is_featured: true }),
      Subscription.countDocuments({ status: 'expired' }),
      Subscription.countDocuments({ status: 'active', end_date: { $gte: nowStr, $lte: thirtyDaysStr } }),
      Contract.countDocuments({ status: { $in: ['active', 'signed'] } }),
      Contract.countDocuments({ status: 'expired' }),
      Invoice.countDocuments({ status: { $in: ['pending', 'partial'] } }),
      Invoice.countDocuments({ status: 'paid' }),
      Invoice.find({ status: 'paid', paid_date: { $gte: startOfMonth } }).lean(),
      Invoice.find({ status: 'paid' }).lean(),
      // Year-specific
      Invoice.find({ issue_date: { $gte: startOfYear, $lte: endOfYear } }).lean(),
      Contract.find({ date: { $gte: startOfYear, $lte: endOfYear } }).lean(),
      Artist.find({ createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } }).lean(),
      Artwork.find({ createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } }).lean(),
      Exhibition.find({ date: { $gte: startOfYear, $lte: endOfYear } }).lean(),
    ])

    const monthlyRevenue = monthlyInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0)
    const yearlyRevenue = allPaidInvoices
      .filter((inv) => inv.paid_date && inv.paid_date >= startOfYear && inv.paid_date <= endOfYear)
      .reduce((acc, inv) => acc + (inv.total || 0), 0)
    const totalRevenue = allPaidInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0)

    // Build monthly chart data for selected year (12 months)
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(year, i, 1)
      const start = d.toISOString().split('T')[0]
      const end = new Date(year, i + 1, 0).toISOString().split('T')[0]
      const label = d.toLocaleDateString('es-ES', { month: 'short' })

      const revenue = yearInvoices
        .filter((inv) => inv.paid_date && inv.paid_date >= start && inv.paid_date <= end)
        .reduce((acc, inv) => acc + (inv.total || 0), 0)

      const invoiced = yearInvoices
        .filter((inv) => inv.issue_date && inv.issue_date >= start && inv.issue_date <= end)
        .reduce((acc, inv) => acc + (inv.total || 0), 0)

      const contracts = yearContracts.filter(
        (c) => c.date && c.date >= start && c.date <= end
      ).length

      const newArtists = (yearArtists as unknown as Array<{ createdAt: Date }>).filter(
        (a) => a.createdAt && a.createdAt >= d && a.createdAt < new Date(year, i + 1, 1)
      ).length

      const newArtworks = (yearArtworks as unknown as Array<{ createdAt: Date }>).filter(
        (a) => a.createdAt && a.createdAt >= d && a.createdAt < new Date(year, i + 1, 1)
      ).length

      const exhibitions = yearExhibitions.filter(
        (e) => e.date && e.date >= start && e.date <= end
      ).length

      return {
        month: label,
        revenue: Math.round(revenue * 100) / 100,
        invoiced: Math.round(invoiced * 100) / 100,
        contracts,
        newArtists,
        newArtworks,
        exhibitions,
      }
    })

    // Legacy revenueChart (last 12 months from today) for dashboard overview
    const revenueChart = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const start = d.toISOString().split('T')[0]
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
      const monthRevenue = allPaidInvoices
        .filter((inv) => inv.paid_date && inv.paid_date >= start && inv.paid_date <= end)
        .reduce((acc, inv) => acc + (inv.total || 0), 0)
      return {
        month: d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        revenue: Math.round(monthRevenue * 100) / 100,
      }
    })

    return NextResponse.json({
      year,
      artists: {
        total: totalArtists,
        active: activeArtists,
        hidden: hiddenArtists,
        featured: featuredArtists,
      },
      subscriptions: {
        expired: expiredSubs,
        expiring_soon: expiringSoonSubs,
      },
      contracts: {
        active: activeContracts,
        expired: expiredContracts,
      },
      invoices: {
        pending: pendingInvoices,
        paid: paidInvoices,
      },
      revenue: {
        monthly: Math.round(monthlyRevenue * 100) / 100,
        yearly: Math.round(yearlyRevenue * 100) / 100,
        total: Math.round(totalRevenue * 100) / 100,
      },
      revenueChart,
      monthlyChart: months,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener métricas', details: String(error) }, { status: 500 })
  }
}
