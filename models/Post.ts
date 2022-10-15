import mongoose, { Schema, plugin, model } from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const Post = new Schema(
  {
    title: { type: String, required: true },
    subTitle: String,
    banner: String,
    content: String,
    categoryId: Array,
    postedAt: String,
    view: {
      type: Array,
      default: []
    },
    like: {
      type: Array,
      default: []
    },
    share: {
      type: Array,
      default: []
    },
    author: String,
    slug: { type: String, slug: 'title', unique: true }
  },
  { timestamps: true }
)

plugin(slug)
Post.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.Post || model('Post', Post)
