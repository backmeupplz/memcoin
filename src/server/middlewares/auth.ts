import { Response, Request, NextFunction } from 'express'
import { getUserByToken } from '../../models/user'

class AuthError  extends Error {
  type = 'AuthError'
  message = 'Not Access!'
  code = 401
}
class NotFoundToken extends AuthError {
  code = 403
  type = 'NotFoundToken'
  message = 'Not found authorization key!'
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const Authkey = req.headers.authorization
  try {
    if (!Authkey) {
      throw new NotFoundToken()
    }
    const user = await getUserByToken(Authkey)
    if (!user) {
      throw new NotFoundToken()
    }
    res.user = user
    next()
  } catch (e) {
    if (e instanceof AuthError) {
      res.status(e.code).json({
        type: e.type,
        message: e.message,
      })
    }
  }
}