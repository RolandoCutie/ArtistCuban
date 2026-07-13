import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IArtist extends Document {
  name: string
  alias?: string
  specialty: string
  category?: string
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
  social_links?: Record<string, string>
  is_featured: boolean
  inspiring_quote?: string
  created_date: Date
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    alias: String,
    specialty: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Pintura', 'Escultura', 'Fotografía', 'Arte Digital', 'Música',
        'Performance', 'Moda', 'Arquitectura', 'Ilustración', 'Cerámica',
        'Grabado', 'Danza', 'Teatro', 'Arte Urbano',
      ],
    },
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
    social_links: { type: Schema.Types.Mixed, default: {} },
    is_featured: { type: Boolean, default: false },
    inspiring_quote: String,
    created_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Artist: Model<IArtist> =
  mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema)

export default Artist
