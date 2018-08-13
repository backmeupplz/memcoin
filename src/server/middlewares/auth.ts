import { Response, Request, NextFunction } from 'express'
import { getUserByToken } from '../../models/user'

class InvalidTokenError extends Error {
  type = 'InvalidTokenError'
  message = 'Invalid token'
  code = 401
}
class TokenNotFoundError extends Error {
  type = 'TokenNotFoundError'
  message = 'Token not provided'
  code = 403
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token
    const token = req.headers.token as string
    // If no token, throw
    if (!token) throw new TokenNotFoundError()
    // Find user
    const user = await getUserByToken(token)
    // If no user, throw
    if (!user) throw new InvalidTokenError()
    // Add user to the request
    req.user = user
    // Continue
    next()
  } catch (error) {
    res.status(error.code || 500).json(error)
  }
}