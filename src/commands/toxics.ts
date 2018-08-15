// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { IUser, getUser, getUserInfo } from '../models'
import { isReply } from './middleware'
import { transfer } from './transfer'

function isToxicMinisters(user: IUser) {
    // Check if ministers
    return [249626104].indexOf(user.chatId) > -1
  }

// Ministry of toxic commands
export function setupToxicCommand(bot: Telegraf<ContextMessageUpdate>) {
    bot.hears('prepareforkick', isReply, isToxicMinisters, checkAssets)
  }

async function checkAssets(ctx: ContextMessageUpdate) {
  // Get defendant
  let sender = await getUser(ctx.message.reply_to_message.from.id)
  // Get defendant Info
  const defendantInfo = await getUserInfo(ctx.telegram, sender)
  // Get amount
  const amount = defendantInfo.balance
  // Get receiver
  const receiver = await getUser(ctx.from.id)
  try {
    // Transfer coins
    await transfer(sender, receiver, amount)
    // Get receiver info
    const receiverInfo = await getUserInfo(ctx.telegram, receiver)
    // Reply
    const text = `Приставы посетили *${defendantInfo.name}* и избяли у Гаражанина *${amount}* Мемкоинов. Теперб у нихм ${defendantInfo.balance} Мемкоинов.`
    await ctx.replyWithMarkdown(text, {
      reply_to_message_id: ctx.message.message_id,
    })
  } catch (err) {
    await ctx.replyWithMarkdown(err.message, {
      reply_to_message_id: ctx.message.message_id,
    })
    return
  }
}