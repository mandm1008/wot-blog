import nc from 'next-connect'
import fs from 'fs/promises'
import formidable from 'formidable'
import path from 'path'
import Image from '~/models/Image'
import { STORE_IMAGES_PATH, IMAGE_DOMAIN } from '~/config/constants'
import { handleError } from '~/tools/middleware'

export default nc({
  onError: handleError
}).post((req, res) => {
  const form = formidable({
    multiples: true,
    maxFileSize: 100 * 1024 * 1024,
    uploadDir: STORE_IMAGES_PATH
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ error: 'error parsing' })
    }

    const keys = Object.keys(files)
    for (const key of keys) {
      const file = files[key]
      if (Array.isArray(file)) return res.status(500).json({ error: 'Error data!' })

      const fileName = encodeURIComponent(
        file.newFilename.replace(/\s/g, '-') +
          (file.originalFilename !== null
            ? file.originalFilename.substring(file.originalFilename.lastIndexOf('.'))
            : '')
      )

      try {
        await fs.rename(file.filepath, path.join(STORE_IMAGES_PATH, fileName))
      } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to rename file: ' + file.newFilename })
      }

      const image = new Image({
        name: file.originalFilename,
        link: `${IMAGE_DOMAIN}/${fileName}`
      })

      try {
        await image.save()
      } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Save image to database error!' })
      }
    }

    res.status(200).json({})
  })
})

export const config = {
  api: {
    bodyParser: false
  }
}
