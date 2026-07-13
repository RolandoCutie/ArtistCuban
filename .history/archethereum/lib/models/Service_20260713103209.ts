import mongoose, { Document, Model, Schema } from 'mongoose'

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
  { timestamps: true, collection: 'artisthub/services' }
)

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)

export default Service
