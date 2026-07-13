import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IEvent extends Document {
  title: string
  date: string
  time?: string
  venue?: string
  city?: string
  country?: string
  artist_name?: string
  artist_id?: string
  ticket_url?: string
  description?: string
  image_url?: string
  type?: string
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: String,
    venue: String,
    city: String,
    country: String,
    artist_name: String,
    artist_id: String,
    ticket_url: String,
    description: String,
    image_url: String,
    type: {
      type: String,
      enum: [
        'Exposición', 'Feria', 'Presentación', 'Concierto',
        'Workshop', 'Masterclass', 'Performance',
      ],
    },
  },
  { timestamps: true }
)

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)

export default Event
