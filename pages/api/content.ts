import nc from 'next-connect'
import { connect } from '../../config/db'
import { handleError, verifyTokenAndAdmin, RequestVerify } from '../../tools/middleware'
import Content from '../../models/Content'

interface Request extends RequestVerify {
  body: Apis.ApiContent.ReqEdit
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .post(async (req: Request, res) => {
    await connect()
    const content = await Content.findOne({ postId: req.body.id })
    content.content = req.body.content

    try {
      await content.save()
    } catch (e) {
      return res.status(403).json({ error: 'Save failed!' })
    }

    res.status(200).json({})
  })
