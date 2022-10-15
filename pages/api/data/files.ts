import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import fs from 'fs/promises'
import path from 'path'
import { connect } from '../../../config/db'
import File from '../../../models/File'
import { verifyTokenAndAdmin, handleError } from '../../../tools/middleware'
import { sort, toObject } from '../../../tools'
import { STORE_FILES_PATH } from '../../../config/constants'

interface RequestGet extends NextApiRequest {
  query: Apis.ApiFiles.ReqGetFiles
}
interface RequestDelete extends NextApiRequest {
  body: Apis.ApiFiles.ReqDeleteFiles
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .get(async (req: RequestGet, res: NextApiResponse<Apis.ApiFiles.ResFiles>) => {
    await connect()

    const page = parseInt(req.query.page || '1', 10)
    const files = sort<Models.File>(toObject(await File.find({})), 'time')
    const data = files.slice((page - 1) * 36, page * 36)

    res.status(200).json({ files: data, totalPages: Math.ceil(files.length / 36) })
  })
  .delete(async (req: RequestDelete, res: NextApiResponse<Apis.Error>) => {
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
