import mongoose, { Schema, plugin, model } from 'mongoose'
import mongooseDelete from 'mongoose-delete'
import slug from 'mongoose-slug-generator'

const Category = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    color: String,
    slug: { type: String, slug: 'title', unique: true }
  },
  { timestamps: true }
)

plugin(slug)
Category.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.Category || model('Category', Category)
