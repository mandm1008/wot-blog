import mongoose, { Schema, model } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const Image = new Schema(
  {
    name: String,
    link: String
  },
  { timestamps: true }
)

Image.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.Image || model('Image', Image)
