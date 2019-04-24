// Dependencies
import { ContextMessageUpdate } from 'telegraf'

export function isPrivate(ctx: ContextMessageUpdate, next: () => any) {
  if (ctx.chat.type === 'private') return next()
  return Promise.resolve()
}

export function isReply(ctx: ContextMessageUpdate, next: () => any) {
  if (
    !ctx.message ||
    (!ctx.message.text && !ctx.message.sticker) ||
    !ctx.message.reply_to_message ||
    !ctx.message.reply_to_message.from
  )
    return Promise.resolve()
  return next()
}

export function checkAdmin(ctx: ContextMessageUpdate, next: () => any) {
  if (ctx.from.id === Number(process.env.ADMIN_ID)) return next()
  return Promise.resolve()
}

export async function checkTime(ctx: ContextMessageUpdate, next: () => any) {
  if (ctx.updateType === 'message') {
    if (
      new Date().getTime() / 1000 - (ctx.message || ctx.channelPost).date <
      5 * 60
    ) {
      next()
    } else {
      console.log(
        `Ignoring message from ${ctx.from.id} at ${
          ctx.chat.id
        } (${new Date().getTime() / 1000}:${
          (ctx.message || ctx.channelPost).date
        })`
      )
    }
  } else {
    next()
  }
}
