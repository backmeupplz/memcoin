// Dependencies
import { Telegram } from 'telegraf'
import { Request } from 'express'
import { IUser } from '../src/models/user'

declare global {
  namespace Express {
    interface Request {
      telegram: Telegram,
      user: IUser,
    }
  }
}  