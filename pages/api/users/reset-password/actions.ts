import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import CryptoJS from 'crypto-js'
import { genSalt, hash } from 'bcrypt'
import { asyncVerify, handleError } from '../../../../tools/middleware'
import { connect } from '../../../../config/db'
import User from '../../../../models/User'

interface Request extends NextApiRequest {
  body: Apis.ApiUser.ReqResetPasswordActions
}

export default nc({
  onError: handleError
}).post(async (req: Request, res: NextApiResponse<Apis.Error>) => {
  const decrypt = CryptoJS.AES.decrypt(req.body.encrypt, process.env.ENCRYPT_SECRET_KEY || '').toString(
    CryptoJS.enc.Utf8
  )
  const [token] = decrypt.split('/')

  try {
    const decoded: Apis.ResetPasswordToken = (await asyncVerify(token, process.env.JWT_ACCESS_KEY || '')) as any
    if (!decoded) return res.status(404).json({ error: 'Link expired!' })

    await connect()
    const user = await User.findById(decoded.id)

    if (!req.body.password) return res.status(404).json({ error: 'Invalid password' })

    const salt = await genSalt(10)
    const password = await hash(req.body.password, salt)
    user.password = password
    await user.save()

    return res.status(200).json({})
  } catch (e) {
    return res.status(403).json({ error: 'Link expired!' })
  }
})
