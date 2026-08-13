import mongoose from 'mongoose'

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Falta MONGODB_URI')
  process.exit(1)
}

await mongoose.connect(uri, { bufferCommands: false })

const col = mongoose.connection.collection('artisthub/artists')
const artists = await col.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] }).toArray()

let updated = 0
for (const a of artists) {
  if (!a.name) continue
  const base = slugify(a.name)
  const exists = await col.findOne({ slug: base, _id: { $ne: a._id } })
  const slug = exists ? `${base}-${Date.now()}` : base
  await col.updateOne({ _id: a._id }, { $set: { slug } })
  updated++
  console.log(`${a.name} -> /artista/${slug}`)
}

console.log(`\nActualizados ${updated} artistas`)
await mongoose.disconnect()
