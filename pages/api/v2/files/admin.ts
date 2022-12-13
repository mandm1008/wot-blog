import { createRoute, routerHandler } from '~/config/nc'
import fs from 'fs/promises'
import path from 'path'
import { connect } from '~/config/db'
import File from '~/models/File'
import { sort, toObject } from '~/tools'
import { STORE_FILES_PATH } from '~/config/constants'
import { verifyTokenAndAdmin } from '~/tools/middleware'

const router = createRoute<
  Apis.ApiFiles.ResFiles,
  {
    query: Apis.ApiFiles.ReqGetFiles
    body: Apis.ApiFiles.ReqDeleteFiles
  }
>()

router
  .use(verifyTokenAndAdmin)
  .get(async (req, res) => {
    await connect()

    const page = parseInt(req.query.page || '1', 10)
    const files = sort(toObject(await File.find<Models.File>({})), 'time')
    const data = files.slice((page - 1) * 36, page * 36)

    res.status(200).json({ files: data, totalPages: Math.ceil(files.length / 36) })
  })
  .delete(async (req, res) => {
    await connect()

    try {
      await File.deleteOne({ _id: req.body.id })
      const fileName = req.body.link.substring(req.body.link.lastIndexOf('/') + 1)
      await fs.unlink(path.join(STORE_FILES_PATH, fileName))
      return res.status(200).json({})
    } catch (e) {
      return res.status(404).json({ error: 'Error deleting file ~~~' })
    }
  })

export default routerHandler(router)
