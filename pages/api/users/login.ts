import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'
import { compare } from 'bcrypt'
import { connect } from '~/config/db'
import User from '~/models/User'
import { handleError } from '~/tools/middleware'

interface Request extends NextApiRequest {
  body: Apis.ApiUser.ReqLogin
}

export default nc({
  onError: handleError
}).post(async (req: Request, res: NextApiResponse<Apis.ApiUser.ResLogin | Apis.Error>) => {
  await connect()

  const { email, password, remember } = req.body
  const user = await User.findOne({ email: email.trim() })

  if (!user) {
    return res.status(404).json({ error: 'Wrong email', value: email })
  }

  const valid = await compare(password, user.password)
  if (!valid) {
    return res.status(403).json({ error: 'Wrong password!', value: password })
  }
  if (valid && user) {
    const accessToken = user.admin
      ? ''
      : sign(
          {
            id: user._id,
            admin: user.admin
          },
          process.env.JWT_ACCESS_KEY || '',
          { expiresIn: '1d' }
        )

    if (remember || user.admin) {
      const refreshToken = sign(
        {
          id: user._id,
          admin: user.admin
        },
        process.env.JWT_ACCESS_KEY || '',
        { expiresIn: user.admin ? '1d' : '30d' }
      )

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', refreshToken, {
          httpOnly: true,
          path: '/',
          secure: true,
          sameSite: 'strict'
        })
      )
    }
    const { password: pass, ...data } = user.toObject() as Models.User
    return res.status(200).json({ accessToken, ...data })
  }
})
