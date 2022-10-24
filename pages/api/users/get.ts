import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'
import { connect } from '~/config/db'
import { verifyToken, handleError, RequestVerify } from '~/tools/middleware'
import User from '~/models/User'

interface Request extends NextApiRequest, RequestVerify {}

export default nc({
  onError: handleError
})
  .use(verifyToken)
  .get(async (req: Request, res: NextApiResponse<Apis.ApiUser.ResGet | Apis.Error>) => {
    await connect()

    if (!req.user) return res.status(404).json({ error: 'Account not found!' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'You are not authenticated!' })

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

    if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie)

      if (cookies.refreshToken) {
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
            // secure: true,
            sameSite: 'strict'
          })
        )
      }
    }
    const { password, ...data } = user.toObject() as Models.User

    res.status(200).json({ accessToken, ...data })
  })
