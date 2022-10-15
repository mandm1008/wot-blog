import mongoose from 'mongoose'

export async function connect() {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/wot-blog`)
  } catch (err) {
    console.log('Connect Failed: ' + err)
  }
}
