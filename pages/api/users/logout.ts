import { NextApiResponse } from 'next'
import nc from 'next-connect'
import cookie from 'cookie'
import { handleError } from '~/tools/middleware'

export default nc({
  onError: handleError
}).get(async (req, res: NextApiResponse<string>) => {
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
