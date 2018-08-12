import { Response, Request, NextFunction } from 'express'

class AuthError  extends Error {
  type = 'AuthError'
  message = 'Not Acess!'
  code = 401
}
class NotFoundToken extends AuthError {
  code = 403
  type = 'NotFoundToken'
  message = 'Not found "Authkey"!'
}

export function auth() {
  return function (req: Request, res: Response, next: NextFunction) {
    const Authkey = req.headers.authkey
    try {
      if (!Authkey) {
        throw new NotFoundToken()
      }
      next();
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(e.code).json({
          type: e.type,
          message: e.message,
        })
      }
    }
  }
}