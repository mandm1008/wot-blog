import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '../../../config/db'
import { verifyToken, handleError, RequestVerify } from '../../../tools/middleware'
import User from '../../../models/User'

interface Request extends NextApiRequest, RequestVerify {
  body: Apis.ApiUser.ReqEdit
}

export default nc({
  onError: handleError
})
  .use(verifyToken)
  .post(async (req: Request, res: NextApiResponse<Apis.ApiUser.ResEdit | Apis.Error>) => {
    await connect()
    if (!req.user || (typeof req.user !== 'string' && !req.user.id))
      return res.status(404).json({ error: 'Account not found!' })

    const user = await User.findById(req.user.id)
    user.name = req.body.name.trim()
    await user.save()
    const { password, ...data } = user.toObject() as Models.User

    res.status(200).json(data)
  })
