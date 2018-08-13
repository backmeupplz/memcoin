// Dependencies
import { Telegram } from 'telegraf'
import { Request } from 'express'
import { User } from '../src/models/user'

declare global {
  namespace Express {
    interface Request {
      telegram: Telegram,
      user: User,
    }
  }
}  