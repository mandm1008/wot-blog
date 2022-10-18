import { NextApiRequest } from 'next'
import nc from 'next-connect'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { connect } from '~/config/db'
import { sendConfirmationEmail } from '~/config/mailer'
import { handleError } from '~/tools/middleware'
import User from '~/models/User'

interface Request extends NextApiRequest {
  query: Apis.ApiUser.ReqActive
}

export default nc({
  onError: handleError
}).get(async (req: Request, res) => {
  await connect()

  const user = await User.findOneWithDeleted({ email: req.query.email })
  if (!user) return res.status(404).json({ error: 'Account not found!' })

  if (!user.deleted) return res.status(200).json({ error: 'Account was active!' })

  const activeAccountToken = sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_ACCESS_KEY || '',
    { expiresIn: '1h' }
  )
  const encrypt = CryptoJS.AES.encrypt(activeAccountToken + '/' + user.email, process.env.ENCRYPT_SECRET_KEY || '')

  try {
    await sendConfirmationEmail({ toUser: user.toObject(), hash: encrypt })
  } catch (e) {
    return res.status(403).json({ error: 'Send confirmation email failed!' })
  }

  res.status(200).json({})
})
