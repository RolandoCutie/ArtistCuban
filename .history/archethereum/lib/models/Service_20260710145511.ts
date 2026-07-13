import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IService extends Document {
  title: string
  description?: string
  artist_id: string
  icon_name?: string
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: String,
    artist_id: { type: String, required: true },
    icon_name: String,
  },
  { timestamps: true }
)

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)

export default Service
