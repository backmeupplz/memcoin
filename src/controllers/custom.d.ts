// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { Response } from 'express'

declare global {
  namespace Express {
    interface Response {
      bot: Telegraf<ContextMessageUpdate>
    }
  }
}  