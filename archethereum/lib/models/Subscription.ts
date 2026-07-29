import mongoose, { Document, Model, Schema } from 'mongoose'

export type SubscriptionStatus = 'active' | 'pending' | 'suspended' | 'expired'

export interface ISubscription extends Document {
  artist_id: string
  artist_name: string
  start_date: string
  end_date: string
  status: SubscriptionStatus
  amount: number
  currency: string
  payment_method?: string
  notes?: string
  renewals: Array<{
    date: string
    amount: number
    payment_method?: string
    notes?: string
  }>
  notified_30_days: boolean
  notified_7_days: boolean
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    artist_id: { type: String, required: true, index: true },
    artist_name: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'expired'],
      default: 'active',
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    payment_method: String,
    notes: String,
    renewals: [
      {
        date: String,
        amount: Number,
        payment_method: String,
        notes: String,
      },
    ],
    notified_30_days: { type: Boolean, default: false },
    notified_7_days: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'artisthub/subscriptions' }
)

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export default Subscription
