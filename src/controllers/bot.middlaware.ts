import { Response, Request, NextFunction } from 'express'
import { Telegraf, ContextMessageUpdate } from 'telegraf'

export function telegraphMiddlware(bot: Telegraf<ContextMessageUpdate>) {
  return function (req: Request, res: Response, next: NextFunction) {
    res.bot = bot;
    next();
  }
}