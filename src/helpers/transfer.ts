// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUser } from '../models'
import { getName } from './name'

export function setupTransfer(bot: Telegraf<ContextMessageUpdate>) {
  bot.use((ctx, next) => {
    try {
      checkTransfer(ctx)
    } catch (err) {
    } finally {
      next()
    }
  })
}

async function checkTransfer(ctx: ContextMessageUpdate) {
  // Check if reply
  if (!ctx.message || !ctx.message.text || !ctx.message.reply_to_message || !ctx.from.id || !ctx.message.reply_to_message.from.id || ctx.message.reply_to_message.from.is_bot) return
  // Get number of coins to send
  const amount = (ctx.message.text.match(/\+/g) || []).length
  // Check amount
  if (!amount) return
  // Get sender
  let sender = await getUser(ctx.from.id)
  // Check if minter
  const isMinter = [249626104, 76104711, 80523220].indexOf(sender.chatId) > -1
  // Check if enough balance
  if (sender.balance < amount && !isMinter) {
    await ctx.reply('Сорямба, у тебя недостаточно Мемкоинов на этот перевод', {
      reply_to_message_id: ctx.message.message_id,
    })
    return
  }
  // Get receiver
  let receiver = await getUser(ctx.message.reply_to_message.from.id)
  if (receiver.chatId === sender.chatId) {
    ctx.replyWithMarkdown(`*Во имя Мемриарха*, астанавись! Сам себе коины тут кидаешь, мне работать нужно, а ведь у меня обед скоро! А ну, *пшел вон, пес*!`, {
      reply_to_message_id: ctx.message.message_id,
    })
    return
  }
  // Transfer
  receiver.balance += amount;
  receiver = await receiver.save()
  // Remove coins
  if (!isMinter) {
    sender.balance -= amount
    sender = await sender.save()
  }
  // Get receiver member
  const receiverMember = await ctx.telegram.getChatMember(ctx.chat.id, receiver.chatId)
  const receiverName = getName(receiverMember)
  // Reply
  const text = isMinter ?
    `*${amount}* Мемкоинов было выдано гаражанину *${receiverName}*` :
    `*${amount}* Мемкоинов было переведено гаражанину *${receiverName}*`
  await ctx.replyWithMarkdown(text, {
    reply_to_message_id: ctx.message.message_id,
  })
}