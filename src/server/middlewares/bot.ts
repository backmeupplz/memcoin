import { Response, Request, NextFunction } from 'express'
import { Telegram } from 'telegraf'

export function telegrafMiddlware(telegram: Telegram) {
  return function (req: Request, _: Response, next: NextFunction) {
    // Attach telegram to the request
    req.telegram = telegram
    // Continue
    next()
  }
}