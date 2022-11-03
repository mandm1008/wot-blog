import mongoose, { Schema, model } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const Comment = new Schema<Models.Comment>(
  {
    idUser: { type: String, required: true },
    idPost: { type: String, required: true },
    content: { type: String, required: true },
    like: { type: Array, default: [] } as { type: any; default: string[] },
    replyId: String
  },
  { timestamps: true }
)

Comment.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.Comment || model('Comment', Comment)
