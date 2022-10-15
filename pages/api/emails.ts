import nc from 'next-connect'
import { connect } from '../../config/db'
import { handleError, verifyTokenAndAdmin, RequestVerify } from '../../tools/middleware'
import Email from '../../models/Email'
import Content from '../../models/Content'
import { NextApiResponse } from 'next'

interface RequestCreate extends RequestVerify {
  body: Apis.ApiEmail.ReqCreate
}

interface RequestEdit extends RequestVerify {
  body: Apis.ApiEmail.ReqEdit
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .post(async (req: RequestCreate, res: NextApiResponse<Apis.ApiEmail.ResCreate | Apis.Error>) => {
    await connect()

    const name = req.body.name.trim()
    const email = new Email({ name })
    await email.save()
    const result: Models.Email = (await Email.findOne({ name })).toObject()
    const content = new Content({ postId: email._id.toString() })
    await content.save()

    res.status(200).json({ result })
  })
  .patch(async (req: RequestEdit, res) => {
    await connect()

    const email = await Email.findOne({ _id: req.body._id })
    email.content = req.body.content
    await email.save()

    res.status(200).json({})
  })
