import nc from 'next-connect'
import fs from 'fs/promises'
import formidable from 'formidable'
import path from 'path'
import File from '../../../models/File'
import { verifyTokenAndAdmin, handleError } from '../../../tools/middleware'
import { STORE_FILES_PATH, FILE_DOMAIN } from '../../../config/constants'

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .post((req, res) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 100 * 1024 * 1024,
      uploadDir: STORE_FILES_PATH
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
          await fs.rename(file.filepath, path.join(STORE_FILES_PATH, fileName))
        } catch (error) {
          console.log(error)
          return res.status(500).json({ error: 'Failed to rename file: ' + file.newFilename })
        }

        const crrFile = new File({
          name: file.originalFilename,
          link: `${FILE_DOMAIN}/${fileName}`
        })

        try {
          await crrFile.save()
        } catch (e) {
          console.log(e)
          return res.status(500).json({ error: 'Save file to database error!' })
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
