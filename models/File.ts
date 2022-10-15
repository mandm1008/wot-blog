import mongoose, { Schema, model } from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const File = new Schema(
  {
    name: String,
    link: String
  },
  { timestamps: true }
)

File.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.models.File || model('File', File)
