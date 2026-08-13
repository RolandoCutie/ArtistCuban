import Exhibition from '@/lib/models/Exhibition'
import connectDB from '@/lib/mongodb'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const STATUS_LABEL: Record<string, string> = {
  active: '● En vivo ahora',
  upcoming: 'Próximamente',
  past: 'Pasada',
}

const STATUS_BADGE: Record<string, string> = {
  active: 'text-green-500',
  upcoming: 'text-blue-400',
  past: 'text-foreground/40',
}

async function getExhibitions() {
  try {
    await connectDB()
    const exhibitions = await Exhibition.find().sort({ date: -1 }).limit(50).lean()
    return exhibitions.map((e) => ({
      _id: String(e._id),
      slug: e.slug,
      title: e.title,
      curator: e.curator,
      artist_name: e.artist_name,
      artist_id: e.artist_id,
      date: e.date,
      end_date: e.end_date,
      cover_url: e.cover_url,
      status: e.status,
      venue: e.venue,
    }))
  } catch {
    return []
  }
}

export default async function VirtualGalleryPage() {
  const exhibitions = await getExhibitions()

  const active = exhibitions.filter((e) => e.status === 'active')
  const upcoming = exhibitions.filter((e) => e.status === 'upcoming')
  const past = exhibitions.filter((e) => e.status === 'past')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          <img
            src="/img/hero-gallery.jpg"
            alt="Galería virtual"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">Experiencia inmersiva</p>
          <h1 className="font-heading text-5xl font-light leading-none text-white md:text-8xl">
            Galería <span className="italic">Virtual</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm text-white/60">
            Explora exposiciones de arte contemporáneo en un espacio digital de clase mundial.
            Sumérgete en la obra de los artistas más destacados.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-32">
        {exhibitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-foreground/50">
            <p className="font-heading text-2xl">No hay exposiciones disponibles.</p>
            <Link href="/dashboard" className="mt-4 text-sm underline">Añade exposiciones en el Dashboard</Link>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Activas */}
            {active.length > 0 && (
              <div>
                <div className="mb-8 flex items-center gap-3">
                  <h2 className="font-heading text-4xl font-light">En vivo</h2>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs uppercase tracking-widest text-green-500">
                    ● {active.length} activa{active.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {active.map((ex) => (
                    <ExhibitionCard key={ex._id} exhibition={ex} large />
                  ))}
                </div>
              </div>
            )}

            {/* Próximas */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="mb-8 font-heading text-4xl font-light">Próximas exposiciones</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((ex) => (
                    <ExhibitionCard key={ex._id} exhibition={ex} />
                  ))}
                </div>
              </div>
            )}

            {/* Pasadas */}
            {past.length > 0 && (
              <div>
                <h2 className="mb-8 font-heading text-4xl font-light text-foreground/50">
                  Exposiciones pasadas
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {past.map((ex) => (
                    <ExhibitionCard key={ex._id} exhibition={ex} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ExhibitionCard({
  exhibition,
  large = false,
}: {
  exhibition: {
    _id: string
    slug?: string
    title: string
    curator?: string
    artist_name?: string
    date?: string
    cover_url?: string
    status: string
    venue?: string
  }
  large?: boolean
}) {
  return (
    <Link
      href={`/exposicion/${exhibition.slug || exhibition._id}`}
      className="group relative overflow-hidden block"
      data-cursor="view"
    >
      <div className={`relative overflow-hidden bg-muted ${large ? 'aspect-[4/3]' : 'aspect-[4/3]'}`}>
        {exhibition.cover_url ? (
          <img
            src={exhibition.cover_url}
            alt={exhibition.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="img-shimmer h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          {exhibition.status !== 'past' && (
            <p className={`mb-2 text-[10px] uppercase tracking-widest ${STATUS_BADGE[exhibition.status] || 'text-white/50'}`}>
              {STATUS_LABEL[exhibition.status]}
            </p>
          )}
          <h3 className={`font-heading font-light text-white ${large ? 'text-3xl' : 'text-2xl'}`}>
            {exhibition.title}
          </h3>
          {(exhibition.curator || exhibition.artist_name) && (
            <p className="mt-1 text-sm text-white/60">
              {[exhibition.curator && `Curado por ${exhibition.curator}`, exhibition.artist_name].filter(Boolean).join(' · ')}
            </p>
          )}
          {exhibition.date && (
            <p className="mt-1 text-xs text-white/40">
              {new Date(exhibition.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              {exhibition.venue && ` · ${exhibition.venue}`}
            </p>
          )}
          <div className="glass mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Entrar <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  )
}
