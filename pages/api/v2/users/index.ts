import { createRoute, routerHandler } from '~/config/nc'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'
import { connect } from '~/config/db'
import { verifyToken, RequestVerify } from '~/tools/middleware'
import User from '~/models/User'

const router = createRoute<Apis.ApiUser.ResGet | Apis.ApiUser.ResEdit, { body: Apis.ApiUser.ReqEdit }>()

router
  .use(verifyToken)
  .get(async (req: RequestVerify, res) => {
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
            secure: true,
            sameSite: 'strict'
          })
        )
      }
    }
    const { password, ...data } = user.toObject() as Models.User

    res.status(200).json({ accessToken, ...data })
  })
  .post(async (req: RequestVerify<{ body: Apis.ApiUser.ReqEdit }>, res) => {
    await connect()
    if (!req.user || (typeof req.user !== 'string' && !req.user.id))
      return res.status(404).json({ error: 'Account not found!' })

    const user = await User.findById(req.user.id)
    user.name = req.body.name.trim()
    await user.save()
    const { password, ...data } = user.toObject() as Models.User

    res.status(200).json(data)
  })

export default routerHandler(router)
