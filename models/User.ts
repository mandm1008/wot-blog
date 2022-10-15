import mongoose, { Schema, model } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    image: { type: String }
  },
  { timestamps: true }
)

User.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.User || model('User', User)
