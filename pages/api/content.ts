import nc from 'next-connect'
import { connect } from '~/config/db'
import { handleError, verifyTokenAndAdmin, RequestVerify } from '~/tools/middleware'
import Content from '~/models/Content'

interface Request extends RequestVerify {
  body: Apis.ApiContent.ReqEdit
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .post(async (req: Request, res) => {
    await connect()
    const dbData = await Content.findOne<Models.Content>({ postId: req.body.id })
    if (!dbData) return res.status(404).json({ error: 'Not found!' })

    const index = dbData.content.findIndex(c => c.userId === req.body.content.userId)
    if (index < 0) {
      dbData.content.push(req.body.content)
    } else {
      dbData.content[index].value = req.body.content.value
    }

    try {
      await dbData.save()
    } catch (e) {
      return res.status(403).json({ error: 'Save failed!' })
    }

    res.status(200).json({})
  })
