import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { genSalt, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { connect } from '~/config/db'
import { sendConfirmationEmail } from '~/config/mailer'
import { handleError } from '~/tools/middleware'
import User from '~/models/User'

interface Request extends NextApiRequest {
  body: Apis.ApiUser.ReqCreate
}

export default nc({
  onError: handleError
}).post(async (req: Request, res: NextApiResponse<Apis.ApiUser.ResCreate | Apis.Error>) => {
  await connect()

  const { name, email, password } = req.body
  const oldUser = await User.findOneWithDeleted({ email: email.trim() })
  if (oldUser) {
    return res.status(403).json({ error: 'Error creating account: Email already used', value: email })
  }

  const salt = await genSalt(10)
  const hashed = await hash(password, salt)

  const user = new User({
    name: name.trim(),
    email: email.trim(),
    password: hashed
  })

  await user.save()
  await user.delete()

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

  res.status(200).json({ email })
})
