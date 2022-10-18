import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import fs from 'fs/promises'
import path from 'path'
import { connect } from '~/config/db'
import Image from '~/models/Image'
import { verifyTokenAndAdmin, handleError } from '~/tools/middleware'
import { sort, toObject } from '~/tools'
import { STORE_IMAGES_PATH } from '~/config/constants'

interface ReqDeleteImages extends NextApiRequest {
  body: Apis.ApiImages.ReqDeleteImages
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .get(async (req: NextApiRequest, res: NextApiResponse<Apis.ApiImages.ResImages>) => {
    await connect()

    const page = parseInt((req.query.page as string) || '1', 10)
    const images = sort<Models.Image>(toObject<Models.Image>(await Image.find({})), 'time')
    const data = images.slice((page - 1) * 36, page * 36)

    res.status(200).json({ images: data, totalPages: Math.ceil(images.length / 36) })
  })
  .delete(async (req: ReqDeleteImages, res: NextApiResponse<Apis.Error>) => {
    await connect()

    try {
      await Image.deleteMany({ _id: req.body.id })
      const fileName = req.body.link.substring(req.body.link.lastIndexOf('/') + 1)
      await fs.unlink(path.join(STORE_IMAGES_PATH, fileName))
      return res.status(200).json({})
    } catch (e) {
      return res.status(404).json({ error: 'Error deleting images ~~~' })
    }
  })
