import mongoose, { Document, Model, Schema } from 'mongoose'

export type ArtistTemplate =
  | 'template1'
  | 'template2'
  | 'template3'
  | 'template4'
  | 'template5'
  | 'template6'
  | 'template7'
  | 'template8'
  | 'template9'
  | 'template10'
  | 'template11'
  | 'template12'
  | 'template13'
  | 'template14'
  | 'template15'

export interface ISocialLinks {
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

export interface IArtistSections {
  bio: boolean
  artworks: boolean
  exhibitions: boolean
  services: boolean
  social: boolean
  contact: boolean
  gallery: boolean
  awards: boolean
  influences: boolean
  education: boolean
}

export interface IArtist extends Document {
  name: string
  slug?: string
  alias?: string
  specialty: string
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
  exhibitions_count: number
  email?: string
  phone?: string
  whatsapp?: string
  social_links?: ISocialLinks
  is_featured: boolean
  is_active: boolean
  template: ArtistTemplate
  sections: IArtistSections
  inspiring_quote?: string
  created_date: Date
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    alias: String,
    specialty: { type: String, required: true },
    categories: [
      {
        type: String,
        enum: [
          'Pintura', 'Escultura', 'Fotografía', 'Arte Digital', 'Música',
          'Performance', 'Moda', 'Arquitectura', 'Ilustración', 'Cerámica',
          'Grabado', 'Danza', 'Teatro', 'Arte Urbano',
        ],
      },
    ],
    country: String,
    city: String,
    bio: String,
    statement: String,
    photo_url: String,
    cover_url: String,
    birth_date: String,
    languages: [String],
    style: String,
    influences: [String],
    techniques: [String],
    education: [String],
    awards: [String],
    exhibitions_count: { type: Number, default: 0 },
    email: String,
    phone: String,
    whatsapp: String,
    social_links: {
      type: {
        facebook: String,
        instagram: String,
        tiktok: String,
        youtube: String,
        behance: String,
        linkedin: String,
        pinterest: String,
        twitter: String,
        website: String,
      },
      default: {},
    },
    is_featured: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true, index: true },
    template: {
      type: String,
      enum: [
        'template1',
        'template2',
        'template3',
        'template4',
        'template5',
        'template6',
        'template7',
        'template8',
        'template9',
        'template10',
        'template11',
        'template12',
        'template13',
        'template14',
        'template15',
      ],
      default: 'template1',
    },
    inspiring_quote: String,
    created_date: { type: Date, default: Date.now },
    sections: {
      type: {
        bio: { type: Boolean, default: true },
        artworks: { type: Boolean, default: true },
        exhibitions: { type: Boolean, default: true },
        services: { type: Boolean, default: true },
        social: { type: Boolean, default: true },
        contact: { type: Boolean, default: true },
        gallery: { type: Boolean, default: false },
        awards: { type: Boolean, default: false },
        influences: { type: Boolean, default: false },
        education: { type: Boolean, default: false },
      },
      default: {
        bio: true, artworks: true, exhibitions: true, services: true,
        social: true, contact: true, gallery: false, awards: false,
        influences: false, education: false,
      },
    },
  },
  { timestamps: true, collection: 'artisthub/artists' }
)

// Indexes for common public queries
ArtistSchema.index({ is_active: 1, createdAt: -1 })
ArtistSchema.index({ is_active: 1, is_featured: 1, createdAt: -1 })
ArtistSchema.index({ categories: 1, is_active: 1, created_date: -1 })
ArtistSchema.index({ name: 'text', alias: 'text', specialty: 'text', categories: 'text' })

ArtistSchema.pre('save', async function () {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name)
  }
})

const Artist: Model<IArtist> =
  mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema)

export default Artist
