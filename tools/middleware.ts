import type { NextApiRequest, NextApiResponse } from 'next'
import { verify, JwtPayload } from 'jsonwebtoken'
import cookie from 'cookie'

export interface AccessType extends JwtPayload {
  id?: string
  admin?: boolean
}

interface RequestExternal {
  user?: AccessType
}

export interface RequestVerify extends NextApiRequest, RequestExternal {}

export async function handleError(error: any, req: NextApiRequest, res: NextApiResponse<Apis.Error>): Promise<void> {
  res.status(500).json({ error: 'Error in server!' })
}

export async function verifyToken(req: RequestVerify, res: NextApiResponse<Apis.Error>, next: () => void) {
  const token = req.headers.token

  if (token && typeof token === 'string') {
    const accessToken = token.split(' ')[1]

    try {
      const user = await asyncVerify(accessToken, process.env.JWT_ACCESS_KEY || '')
      if (typeof user === 'string') return res.status(404).json({ error: 'Token is invalid!' })
      req.user = user
      next()
      return
    } catch (e) {
      if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie)

        if (cookies.refreshToken) {
          try {
            const user = await asyncVerify(cookies.refreshToken, process.env.JWT_ACCESS_KEY || '')
            if (typeof user === 'string') return res.status(404).json({ error: 'Token is invalid!' })
            req.user = user
            next()
            return
          } catch (e) {
            console.log(e)
          }
        }
      } else return res.status(401).json({ error: 'You are not authenticated' })

      return res.status(403).json({ error: 'Token is invalid' })
    }
  } else {
    res.status(401).json({ error: 'You are not authenticated' })
  }
}

export async function verifyTokenAndAdmin(req: RequestVerify, res: NextApiResponse<Apis.Error>, next: () => void) {
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie)

    if (cookies.refreshToken) {
      try {
        const user = await asyncVerify(cookies.refreshToken, process.env.JWT_ACCESS_KEY || '')
        if (typeof user === 'string') return res.status(404).json({ error: 'Token is invalid!' })
        req.user = user
        next()
        return
      } catch (e) {
        res.status(403).json({ error: 'Token is invalid' })
        console.log(e)
      }
    }
  } else res.status(401).json({ error: 'You are not authenticated' })
}

export async function verifyAdmin(req: NextApiRequest) {
  const redirectObject = {
    redirect: {
      destination: '/admin/login'
    },
    props: {}
  }

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}

  if (cookies.refreshToken) {
    try {
      const user: AccessType | string | undefined = await asyncVerify(
        cookies.refreshToken,
        process.env.JWT_ACCESS_KEY || ''
      )
      if (typeof user !== 'string' && user && user.admin) return
    } catch (e) {
      return redirectObject
    }
  }

  return redirectObject
}

export const asyncVerify = (token: string, secret: string) =>
  new Promise<string | AccessType | undefined>((res, rej) =>
    verify(token, secret, (err, data) => (err ? rej({ error: err }) : res(data)))
  )
