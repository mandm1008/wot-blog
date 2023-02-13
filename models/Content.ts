import mongoose, { Schema, model } from 'mongoose'

const Content = new Schema<Models.Content>(
  {
    postId: String,
    content: {
      type: Array,
      default: []
    } as {
      type: any
      default: []
    }
  },
  { timestamps: true }
)

export default mongoose.models.Content || model('Content', Content)
