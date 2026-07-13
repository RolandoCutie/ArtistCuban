import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IExhibition extends Document {
  title: string
  curator?: string
  artist_name?: string
  artist_id?: string
  date?: string
  end_date?: string
  description?: string
  cover_url?: string
  status: 'active' | 'upcoming' | 'past'
  schedule?: string
  venue?: string
  artwork_ids: string[]
}

const ExhibitionSchema = new Schema<IExhibition>(
  {
    title: { type: String, required: true },
    curator: String,
    artist_name: String,
    artist_id: String,
    date: String,
    end_date: String,
    description: String,
    cover_url: String,
    status: {
      type: String,
      enum: ['active', 'upcoming', 'past'],
      default: 'upcoming',
    },
    schedule: String,
    venue: String,
    artwork_ids: [String],
  },
  { timestamps: true }
)

const Exhibition: Model<IExhibition> =
  mongoose.models.Exhibition ||
  mongoose.model<IExhibition>('Exhibition', ExhibitionSchema)

export default Exhibition
