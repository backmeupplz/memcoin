// Dependencies
import { Telegraf, ContextMessageUpdate, Middleware } from 'telegraf'
import { getUser, setTokenFor, resetTokenFor } from '../models'
import { getName } from '../helpers/name'
import { checkAdmin, isPrivate, isReply } from '../helpers/middleware'

// token commands
export function setupToken(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('token', isPrivate, async (ctx) => {
    // Find user
    const user = await getUser(ctx.from.id)
    // Prepare text
    const text = user.tokenApi ? `*Токен*:\n\`${user.tokenApi}\`` : 'У вас нет доступа к API!'
    // Reply
    ctx.replyWithMarkdown(text)
  })

  bot.command('open_access', checkAdmin, isReply, async (ctx) => {
    const promotedUserID = ctx.message.reply_to_message.from.id
    // Open access
    await setTokenFor(promotedUserID)
    const member = await ctx.telegram.getChatMember(ctx.chat.id, promotedUserID)
    // Prepare text
    const text = `Выдал доступ к API *${getName(member)}*`
    // Reply
    ctx.replyWithMarkdown(text)
  })

  bot.command('revoke', checkAdmin, isReply, async (ctx) => {
    const reducedUserID = ctx.message.reply_to_message.from.id
    // Revoke access
    await resetTokenFor(reducedUserID)
    const member = await ctx.telegram.getChatMember(ctx.chat.id, reducedUserID)
    // Prepare text
    const text = `Закрыл доступ к API *${getName(member)}*`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}