import mongoose from 'mongoose'
import { logger } from '~/tools/helper'

export async function connect() {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/wot-blog`)
  } catch (err: any) {
    await logger(err)
    console.log('Connect Failed: ' + err)
  }
}
