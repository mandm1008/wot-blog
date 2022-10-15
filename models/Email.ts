import mongoose, { Schema, plugin, model } from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const Email = new Schema(
  {
    name: { type: String, required: true },
    content: String,
    sended: { type: Array, default: [] },
    slug: { type: String, slug: 'name', unique: true }
  },
  { timestamps: true }
)

plugin(slug)
Email.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.Email || model('Email', Email)