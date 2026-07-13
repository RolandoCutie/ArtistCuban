import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import connectDB from '@/lib/mongodb'
import Artist from '@/lib/models/Artist'
import Exhibition from '@/lib/models/Exhibition'
import Event from '@/lib/models/Event'
import Hero from '@/components/home/Hero'
import FeaturedArtists from '@/components/home/FeaturedArtists'
import CategoryExplorer from '@/components/home/CategoryExplorer'
import VirtualGalleryPreview from '@/components/home/VirtualGalleryPreview'
import UpcomingEvents from '@/components/home/UpcomingEvents'

async function getData() {
  try {
    await connectDB()
    const [artists, featuredArtists, exhibitions, events] = await Promise.all([
      Artist.find({}).sort({ createdAt: -1 }).limit(100).lean(),
      Artist.find({ is_featured: true }).sort({ createdAt: -1 }).limit(6).lean(),
      Exhibition.find({}).sort({ date: -1 }).limit(4).lean(),
      Event.find({}).sort({ date: 1 }).limit(4).lean(),
    ])
    return { artists, featuredArtists, exhibitions, events }
  } catch {
    return { artists: [], featuredArtists: [], exhibitions: [], events: [] }
  }
}

export default async function HomePage() {
  const { artists, featuredArtists, exhibitions, events } = await getData()

  const artistsForSearch = artists.map((a) => ({
    _id: String(a._id),
    name: a.name,
    alias: a.alias,
    specialty: a.specialty,
    category: a.category,
    city: a.city,
    country: a.country,
    photo_url: a.photo_url,
  }))

  const featuredForDisplay = featuredArtists.map((a) => ({
    _id: String(a._id),
    name: a.name,
    specialty: a.specialty,
    city: a.city,
    country: a.country,
    photo_url: a.photo_url,
    exhibitions_count: a.exhibitions_count,
  }))

  const exhibitionsForDisplay = exhibitions.map((e) => ({
    _id: String(e._id),
    title: e.title,
    curator: e.curator,
    artist_name: e.artist_name,
    date: e.date,
    cover_url: e.cover_url,
    status: e.status,
  }))

  const eventsForDisplay = events.map((ev) => ({
    _id: String(ev._id),
    title: ev.title,
    date: ev.date,
    time: ev.time,
    venue: ev.venue,
    city: ev.city,
    country: ev.country,
    artist_name: ev.artist_name,
    ticket_url: ev.ticket_url,
    type: ev.type,
  }))

  return (
    <>
      <Hero artists={artistsForSearch} />

      {/* Manifesto */}
      <section className="border-t border-border bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-foreground/40">
            Nuestra filosofía
          </p>
          <blockquote className="font-heading text-3xl font-light leading-tight text-balance md:text-5xl">
            No somos un directorio. Somos un{' '}
            <span className="italic">espacio sagrado</span> donde cada obra
            respira, donde cada artista encuentra al coleccionista que comprende
            su lenguaje.
          </blockquote>
          <Link
            href="/#artistas"
            className="group mt-12 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm uppercase tracking-widest transition-all hover:gap-4"
          >
            Conoce a los artistas
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <FeaturedArtists artists={featuredForDisplay} />
      <CategoryExplorer />
      <VirtualGalleryPreview exhibitions={exhibitionsForDisplay} />
      <UpcomingEvents events={eventsForDisplay} />

      {/* CTA */}
      <section
        id="contacto"
        className="border-t border-border bg-foreground py-24 text-background lg:py-32"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-background/40">
                Únete como artista
              </p>
              <h2 className="font-heading text-5xl font-light text-background md:text-6xl">
                ¿Eres artista?
                <br />
                <span className="italic text-background/50">
                  Tu obra merece este escenario.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-background/50">
                Archethereum es la plataforma donde los artistas de clase mundial
                se encuentran con los coleccionistas, curadores y galerías que
                comprenden el verdadero valor de su trabajo.
              </p>
              <Link
                href="/dashboard"
                className="group mt-8 inline-flex items-center gap-2 border-b border-background pb-1 text-sm uppercase tracking-widest text-background transition-all hover:gap-4"
              >
                Solicitar ingreso
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="space-y-8">
              <div className="border-t border-background/20 pt-6">
                <h3 className="font-heading text-2xl text-background">
                  Para galerías y coleccionistas
                </h3>
                <p className="mt-3 text-sm text-background/50">
                  Accede a una selección curada de artistas emergentes y
                  consagrados. Conecta directamente y construye relaciones
                  duraderas con los creadores del futuro.
                </p>
              </div>
              <div className="border-t border-background/20 pt-6">
                <h3 className="font-heading text-2xl text-background">
                  Para patrocinadores
                </h3>
                <p className="mt-3 text-sm text-background/50">
                  Asocia tu marca al arte de mayor impacto cultural de nuestra
                  era. Archethereum ofrece oportunidades únicas de patrocinio con
                  visibilidad global.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
