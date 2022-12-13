import { createRoute, routerHandler } from '~/config/nc'
import { sign } from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { genSalt, hash } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import { connect } from '~/config/db'
import { sendVerifyEmail } from '~/config/mailer'
import User from '~/models/User'

const router = createRoute<Apis.ApiUser.ResCreate, { body: Apis.ApiUser.ReqCreate | any }>()

router
  .post('/', async (req, res) => {
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
      await sendVerifyEmail({ toUser: user.toObject(), hash: encrypt })
    } catch (e) {
      return res.status(403).json({ error: 'Send confirmation email failed!' })
    }

    res.status(200).json({ email })
  })
  .post('/google', async (req, res) => {
    await connect()

    const client = new OAuth2Client(process.env.ACCOUNT_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.ACCOUNT_CLIENT_ID
    })
    const payload = ticket.getPayload()
    if (!payload) return res.status(500).json({ error: 'Error in server!' })

    let rememberUser = await User.findOne({ email: payload.email })
    if (!rememberUser) {
      rememberUser = new User({
        name: payload.name,
        email: payload.email,
        password: payload.sub,
        image: payload.picture
      })
    } else {
      rememberUser.image = payload.picture
    }

    await rememberUser.save()
    rememberUser = await User.findOne({ email: payload.email })
    const accessToken = sign(
      {
        id: rememberUser._id
      },
      process.env.JWT_ACCESS_KEY || '',
      { expiresIn: '1d' }
    )
    const { password, ...data } = rememberUser.toObject()

    res.status(200).json({ accessToken, ...data })
  })

export default routerHandler(router)
