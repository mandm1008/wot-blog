import formidable, { Options, Fields, Files } from 'formidable'
import { IncomingMessage } from 'http'

export const parseFormData = (request: IncomingMessage, options: Options) =>
  new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    const form = formidable(options)

    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      return resolve({ fields, files })
    })
  })
