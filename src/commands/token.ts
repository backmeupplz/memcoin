// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUser, generateApiTokenForUser, revokeApiTokenForUser } from '../models'
import { getName } from '../helpers/name'
import { checkAdmin, isPrivate, isReply } from '../helpers/middleware'

// Token commands
export function setupToken(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('token', isPrivate, async (ctx) => {
    // Find user
    const user = await getUser(ctx.from.id)
    // Prepare text
    const text = user.apiToken ? `*Токен*:\n\`\`\`${user.apiToken}\`\`\`` : 'У вас нет доступа к API — обратитесь за ним к @borodutch.'
    // Reply
    ctx.replyWithMarkdown(text)
  })

  bot.command('give', checkAdmin, isReply, async (ctx) => {
    const promotedUserID = ctx.message.reply_to_message.from.id
    // Open access
    await generateApiTokenForUser(promotedUserID)
    const member = await ctx.telegram.getChatMember(ctx.chat.id, promotedUserID)
    // Prepare text
    const text = `Выдал доступ к API *${getName(member)}*`
    // Reply
    ctx.replyWithMarkdown(text)
  })

  bot.command('take', checkAdmin, isReply, async (ctx) => {
    const reducedUserID = ctx.message.reply_to_message.from.id
    // Revoke access
    await revokeApiTokenForUser(reducedUserID)
    const member = await ctx.telegram.getChatMember(ctx.chat.id, reducedUserID)
    // Prepare text
    const text = `Закрыл доступ к API *${getName(member)}*`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}