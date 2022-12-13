import { createRoute, routerHandler } from '~/config/nc'
import cookie from 'cookie'

const router = createRoute<string>()

router.get(async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', '', {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 0
    })
  )
  res.status(200).json('Logout successfully!')
})

export default routerHandler(router)
