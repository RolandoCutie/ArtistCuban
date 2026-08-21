export interface Artwork {
  _id: string
  title: string
  series?: string
  description?: string
  history?: string
  technique?: string
  material?: string
  year?: number
  price?: number
  available?: boolean
  sold?: boolean
  edition?: string
  dimensions?: string
  weight?: string
  certificate?: string
  image_url?: string
}

export interface Artist {
  _id: string
  name: string
  alias?: string
  specialty?: string
  categories?: string[]
  country?: string
  city?: string
  bio?: string
  statement?: string
  photo_url?: string
  cover_url?: string
  birth_date?: string
  languages?: string[]
  style?: string
  influences?: string[]
  techniques?: string[]
  education?: string[]
  awards?: string[]
  exhibitions_count?: number
  email?: string
  phone?: string
  whatsapp?: string
  is_featured?: boolean
  is_active?: boolean
  template?: string
  inspiring_quote?: string
  social_links?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    behance?: string
    linkedin?: string
    pinterest?: string
    twitter?: string
    website?: string
  }
}

export interface Service {
  _id: string
  title: string
  description?: string
  icon_name?: string
}

export interface Exhibition {
  _id: string
  title: string
  slug?: string
  type?: string
  curator?: string
  date?: string
  end_date?: string
  description?: string
  cover_url?: string
  gallery_urls?: string[]
  status?: string
  venue?: string
  location?: string
}

export interface LayoutProps {
  artist: Artist
  artworks: Artwork[]
  services: Service[]
  exhibitions: Exhibition[]
  modalArtwork: Artwork | null
  modalIndex: number
  openModal: (artwork: Artwork) => void
  navigateArtwork: (dir: 1 | -1) => void
  closeModal: () => void
}
