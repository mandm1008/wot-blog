import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { connect } from '../../../../config/db'
import User from '../../../../models/User'
import { sendResetPasswordEmail, EmailData } from '../../../../config/mailer'
import { handleError } from '../../../../tools/middleware'

interface Request extends NextApiRequest {
  body: Apis.ApiUser.ReqResetPassword
}

export default nc({
  onError: handleError
}).post(async (req: Request, res: NextApiResponse<Apis.Error>) => {
  await connect()

  const email = req.body.email.trim()
  let user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ error: 'Wrong email', value: email })
  }
  user = user.toObject()

  const resetPasswordToken = sign(
    {
      id: user._id,
      name: user.name,
      email: user.email
    },
    process.env.JWT_ACCESS_KEY || '',
    { expiresIn: '600s' }
  )
  const encrypt = CryptoJS.AES.encrypt(resetPasswordToken + '/' + user.email, process.env.ENCRYPT_SECRET_KEY || '')

  await sendResetPasswordEmail({ toUser: user, hash: encrypt })

  res.status(200).json({})
})
