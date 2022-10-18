import nc from 'next-connect'
import { sign } from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { connect } from '~/config/db'
import User from '~/models/User'
import { handleError } from '~/tools/middleware'

export default nc({
  onError: handleError
}).post(async (req, res) => {
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
