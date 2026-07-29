import ArtistCard from '@/components/ArtistCard'

interface FeaturedArtistsProps {
  artists: {
    _id: string
    slug?: string
    name: string
    specialty?: string
    city?: string
    country?: string
    photo_url?: string
    exhibitions_count?: number
  }[]
}

export default function FeaturedArtists({ artists }: FeaturedArtistsProps) {
  return (
    <section id="artistas" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">
              Selección curatorial
            </p>
            <h2 className="font-heading text-5xl font-light leading-none md:text-7xl">
              Artistas <span className="italic">destacados</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-foreground/50">
            Una curaduría cuidadosa de los creadores más relevantes del panorama artístico contemporáneo
            internacional.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="img-shimmer aspect-[3/4]" />
                <div className="mt-4 h-6 w-3/4 img-shimmer rounded" />
                <div className="mt-2 h-4 w-1/2 img-shimmer rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist, i) => (
              <ArtistCard key={artist._id} artist={artist} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
