import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.conn
    }
    cached.conn = null
    cached.promise = null
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('Por favor define MONGODB_URI en el archivo .env.local')
    }
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,  // fail fast if Atlas unreachable
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
