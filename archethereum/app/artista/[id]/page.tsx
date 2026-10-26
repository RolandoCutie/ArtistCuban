import ArtistViewer from '@/app/artista/[id]/components/ArtistViewer'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import ArtistModel from '@/lib/models/Artist'
import ArtworkModel from '@/lib/models/Artwork'
import ExhibitionModel from '@/lib/models/Exhibition'
import ServiceModel from '@/lib/models/Service'
import SubscriptionModel from '@/lib/models/Subscription'
import connectDB from '@/lib/mongodb'
import { slugify } from '@/lib/slug'
import { TEMPLATES } from '@/lib/templates'
import mongoose from 'mongoose'
import { cookies } from 'next/headers'
import Link from 'next/link'

const VALID_TEMPLATE_IDS = new Set(TEMPLATES.map((tpl) => tpl.id))

function resolvePreviewTemplate(raw?: string | string[]): string | undefined {
  const candidate = Array.isArray(raw) ? raw[0] : raw
  if (!candidate) return undefined
  return VALID_TEMPLATE_IDS.has(candidate) ? candidate : undefined
}

/** Returns true if the artist has NO expired/suspended subscription blocking them */
async function checkSubscriptionActive(artistId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  // Find the most recent subscription for this artist
  const sub = await SubscriptionModel.findOne({ artist_id: artistId })
    .sort({ end_date: -1 })
    .lean()
  if (!sub) return true // No subscription record → show profile
  // Block if subscription exists but is expired or suspended
  if (sub.status === 'expired' || sub.status === 'suspended') return false
  // Block if active/pending but end_date has passed
  if (sub.end_date < today) return false
  return true
}

async function getArtistData(id: string) {
  try {
    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
    let artist = null

    if (isObjectId) {
      artist = await ArtistModel.findById(id).lean()
    } else {
      artist = await ArtistModel.findOne({ slug: id }).lean()
      if (!artist) {
        const all = await ArtistModel.find({}).select('name slug _id').lean()
        const match = all.find((a) => slugify(a.name) === id)
        if (match) artist = await ArtistModel.findById(match._id).lean()
      }
    }

    if (!artist) return null

    const artistId = String(artist._id)
    const artistName = (artist as { name?: string }).name ?? ''

    const [artworks, services, exhibitions] = await Promise.all([
      ArtworkModel.find({ artist_id: artistId }).sort({ createdAt: -1 }).lean(),
      ServiceModel.find({ artist_id: artistId }).sort({ createdAt: -1 }).lean(),
      ExhibitionModel.find({
        $or: [
          { artist_id: artistId },
          { artist_ids: artistId },
          { artist_name: artistName },
        ],
        visible: { $ne: false },
      })
        .select('_id title slug type date end_date description cover_url gallery_urls status venue location curator')
        .sort({ date: -1 })
        .limit(12)
        .lean(),
    ])

    return { artist, artworks, services, exhibitions }
  } catch {
    return null
  }
}

export default async function ArtistDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const localeCookie = cookieStore.get('archethereum_locale')?.value
  const locale = isValidLocale(localeCookie) ? localeCookie : 'es'
  const t = getDictionary(locale)
  const expectedAdminToken = process.env.ADMIN_SESSION_SECRET || 'archethereum-admin-secret-2026'
  const adminToken = cookieStore.get('admin_token')?.value
  const previewTemplate =
    adminToken === expectedAdminToken
      ? resolvePreviewTemplate(resolvedSearchParams?.previewTemplate)
      : undefined

  const data = await getArtistData(id)

  if (!data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-heading text-4xl font-light text-foreground/30">404</p>
        <p className="font-heading text-xl text-foreground/50">{t.profile.notFound}</p>
        <Link href="/" className="text-sm underline text-foreground/40 transition-colors hover:text-foreground">
          {t.profile.backHome}
        </Link>
      </div>
    )
  }

  const { artist, artworks, services, exhibitions } = data

  if (artist.is_active === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="mx-auto max-w-md">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-foreground/30">Archethereum</p>
          <div className="mb-8 mx-auto h-px w-16 bg-foreground/20" />
          <h1 className="font-heading text-4xl font-light leading-tight text-foreground/60 md:text-5xl">
            {t.profile.profileUnavailable}
          </h1>
          <p className="mt-6 text-sm text-foreground/40">{t.profile.profileUnavailableDesc}</p>
          <Link
            href="/artistas"
            className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest text-foreground/40 transition-colors hover:border-foreground/60 hover:text-foreground/60"
          >
            {t.profile.exploreArtists}
          </Link>
        </div>
      </div>
    )
  }

  // Serialize Mongoose docs to plain objects for client components
  const artistPlain = JSON.parse(JSON.stringify(artist))
  const artistWithPreview = previewTemplate
    ? { ...artistPlain, template: previewTemplate }
    : artistPlain
  const artworksPlain = JSON.parse(JSON.stringify(artworks))
  const servicesPlain = JSON.parse(JSON.stringify(services))
  const exhibitionsPlain = JSON.parse(JSON.stringify(exhibitions))

  return (
    <ArtistViewer
      artist={artistWithPreview}
      artworks={artworksPlain}
      services={servicesPlain}
      exhibitions={exhibitionsPlain}
      previewTemplate={previewTemplate}
    />
  )
}
