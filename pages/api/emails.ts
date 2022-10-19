import nc from 'next-connect'
import { sendNotificationEmail } from '~/config/mailer'
import { connect } from '~/config/db'
import { handleError, verifyTokenAndAdmin, RequestVerify } from '~/tools/middleware'
import { getAllEmailOfUser } from '~/tools/user'
import { getAllEmail } from '~/tools/email'
import Email from '~/models/Email'
import Content from '~/models/Content'
import { NextApiResponse } from 'next'

interface RequestCreate extends RequestVerify {
  body: Apis.ApiEmail.ReqCreate
}

interface RequestEdit extends RequestVerify {
  body: Apis.ApiEmail.ReqEdit
}

interface RequestSend extends RequestVerify {
  query: Apis.ApiEmail.ReqSend
}

interface RequestCopy extends RequestVerify {
  body: Apis.ApiEmail.ReqCopy
}

interface RequestDelete extends RequestVerify {
  query: Apis.ApiDelete.ReqQuery
  body: Apis.ApiDelete.ReqBody
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .get(async (req: RequestSend, res) => {
    await connect()

    const email = await Email.findById(req.query._id)
    if (!email.title || !email.content) return res.status(404).json({ error: 'Content or Title not found!!!' })
    if (email.sended) return res.status(403).json({ error: 'Email was sended!!!' })
    email.sended = new Date().toISOString()
    await email.save()
    const data: Models.Email = email.toObject()

    const userEmails = await getAllEmailOfUser()
    await sendNotificationEmail({ subject: data.title || '', content: data.content || '', users: userEmails })

    res.status(200).json({})
  })
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
  .put(async (req: RequestCopy, res: NextApiResponse<Apis.ApiEmail.ResCopy | Apis.Error>) => {
    await connect()

    if (!req.body._id) return res.status(404).json({ error: 'Email id not found!' })
    const oldEmail: Models.Email | undefined = (await Email.findById(req.body._id))?.toObject()
    if (!oldEmail) return res.status(404).json({ error: 'Email not found!' })

    const newEmail = new Email({
      name: oldEmail.name + '-copy',
      title: oldEmail.title,
      content: oldEmail.content
    })
    await newEmail.save()
    const content = new Content({ postId: newEmail._id.toString() })
    await content.save()

    res.status(200).json({ data: await getAllEmail() })
  })
  .patch(async (req: RequestEdit, res) => {
    await connect()

    const email = await Email.findOne({ _id: req.body._id })
    email.name = req.body.name
    email.content = req.body.content
    email.title = req.body.title
    await email.save()

    res.status(200).json({})
  })
  .delete(async (req: RequestDelete, res: NextApiResponse<Apis.ApiDelete.Res | Apis.Error>) => {
    await connect()

    await Email.deleteMany({ _id: { $in: req.body.ids } })
    await Content.deleteMany({ postId: { $in: req.body.ids } })

    return res.status(200).json({ ids: req.body.ids })
  })
