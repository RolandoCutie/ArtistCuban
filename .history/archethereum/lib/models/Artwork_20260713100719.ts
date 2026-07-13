import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IArtwork extends Document {
  title: string
  series?: string
  description?: string
  history?: string
  technique?: string
  material?: string
  year?: number
  price?: number
  available: boolean
  sold: boolean
  edition?: string
  dimensions?: string
  weight?: string
  certificate?: string
  image_url?: string
  artist_id: string
  category?: string
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true },
    series: String,
    description: String,
    history: String,
    technique: String,
    material: String,
    year: Number,
    price: Number,
    available: { type: Boolean, default: true },
    sold: { type: Boolean, default: false },
    edition: String,
    dimensions: String,
    weight: String,
    certificate: String,
    image_url: String,
    artist_id: { type: String, required: true },
    category: String,
  },
  { timestamps: true }
)

const Artwork: Model<IArtwork> =
  mongoose.models.Artwork || mongoose.model<IArtwork>('Artwork', ArtworkSchema)

export default Artwork
