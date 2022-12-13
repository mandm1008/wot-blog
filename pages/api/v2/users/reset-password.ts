import { createRoute, routerHandler } from '~/config/nc'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { genSalt, hash } from 'bcrypt'
import { connect } from '~/config/db'
import User from '~/models/User'
import { sendResetPasswordEmail } from '~/config/mailer'
import { asyncVerify } from '~/tools/middleware'

const router = createRoute<Apis.Error, { body: Apis.ApiUser.ReqResetPassword & Apis.ApiUser.ReqResetPasswordActions }>()

router
  .post('/', async (req, res) => {
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
  .post('action', async (req, res) => {
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

export default routerHandler(router)
