// Dependencies
import { ContextMessageUpdate } from 'telegraf'

export function isPrivate(ctx: ContextMessageUpdate, next: () => any) {
  if (ctx.chat.type === 'private') return next()
  return Promise.resolve()
}

export function isReply(ctx: ContextMessageUpdate, next: () => any) {
  console.log(ctx.message)
  if (
    !ctx.message ||
    !ctx.message.text ||
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
