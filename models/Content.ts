import mongoose, { Schema, model } from 'mongoose'

const Content = new Schema(
  {
    postId: String,
    content: String
  },
  { timestamps: true }
)

export default mongoose.models.Content || model('Content', Content)
