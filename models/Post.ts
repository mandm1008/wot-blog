import mongoose, { Schema, plugin, model } from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const Post = new Schema<Models.Post>(
  {
    title: { type: String, required: true },
    subTitle: String,
    banner: String,
    content: String,
    categoryId: Array,
    postedAt: String,
    view: {
      type: Number,
      default: 0
    },
    like: {
      type: Array,
      default: []
    } as { type: any; default: string[] },
    share: {
      type: Number,
      default: 0
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
