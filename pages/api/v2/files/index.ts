import { createRoute, routerHandler } from '~/config/nc'
import fs from 'fs/promises'
import path from 'path'
import { parseFormData } from '~/config/formidable'
import File from '~/models/File'
import { verifyTokenAndAdmin } from '~/tools/middleware'
import { STORE_FILES_PATH, FILE_DOMAIN } from '~/config/constants'

const router = createRoute()

router.use(verifyTokenAndAdmin).post(async (req, res) => {
  try {
    const { files } = await parseFormData(req, {
      multiples: true,
      maxFileSize: 100 * 1024 * 1024,
      uploadDir: STORE_FILES_PATH
    })

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
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'error parsing' })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default routerHandler(router)
