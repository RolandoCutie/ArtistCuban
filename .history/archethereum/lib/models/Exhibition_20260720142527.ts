import mongoose, { Document, Model, Schema } from 'mongoose'

export type ExhibitionType = 'solo' | 'collective' | 'gallery' | 'museum' | 'event' | 'fair'
export type ExhibitionStatus = 'active' | 'upcoming' | 'past'

export interface IExhibition extends Document {
  title: string
  type: ExhibitionType
  curator?: string
  // Legacy single-artist fields (kept for backward compatibility)
  artist_name?: string
  artist_id?: string
  // Multi-artist support
  artist_ids: string[]
  date?: string
  end_date?: string
  description?: string
  cover_url?: string
  gallery_urls: string[]
  banner_url?: string
  status: ExhibitionStatus
  schedule?: string
  venue?: string
  location?: string
  sponsors: string[]
  artwork_ids: string[]
  /** Whether the exhibition is visible on the public site */
  visible: boolean
  tags: string[]
}

const ExhibitionSchema = new Schema<IExhibition>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['solo', 'collective', 'gallery', 'museum', 'event', 'fair'],
      default: 'solo',
    },
    curator: String,
    artist_name: String,
    artist_id: String,
    artist_ids: { type: [String], default: [] },
    date: String,
    end_date: String,
    description: String,
    cover_url: String,
    gallery_urls: { type: [String], default: [] },
    banner_url: String,
    status: {
      type: String,
      enum: ['active', 'upcoming', 'past'],
      default: 'upcoming',
    },
    schedule: String,
    venue: String,
    location: String,
    sponsors: { type: [String], default: [] },
    artwork_ids: { type: [String], default: [] },
    visible: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'artisthub/exhibitions' }
)

// Index for fast queries by artist
ExhibitionSchema.index({ artist_id: 1 })
ExhibitionSchema.index({ artist_ids: 1 })
ExhibitionSchema.index({ status: 1, visible: 1 })

const Exhibition: Model<IExhibition> =
  mongoose.models.Exhibition ||
  mongoose.model<IExhibition>('Exhibition', ExhibitionSchema)

export default Exhibition
