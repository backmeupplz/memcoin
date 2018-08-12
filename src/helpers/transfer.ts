// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User, getUser } from '../models/user'
import { getName } from './name'
import { isReply } from './middleware'

export function setupTransfer(bot: Telegraf<ContextMessageUpdate>) {
  bot.hears(/\+/g, isReply, checkTransfer)
}

export class TransferError extends Error {
  type = 'ErrorNotEnotherCoins'
  message = 'Произошла ошибка при переводе средств'
}

export class NotEnoughCoinsError extends TransferError {
  type = 'NotEnoughCoinsError'
  message = 'Сорямба, у пользователя недостаточно Мемкоинов для этого перевода'
}

export class SendSelfError extends TransferError {
  type = 'SendSelfError'
  message = `*Во имя Мемриарха*, астанавись! Сами себе коины тут кидают, мне работать нужно, а ведь у меня обед скоро! А ну, *пшел вон, пес*!`
}

export async function transfer(sender: User, receiver: User, amount: number) {
  // Check if receiver is not the same as sender
  if (receiver.chatId === sender.chatId) {
    throw new SendSelfError()
  }

  // Check if enough balance
  if (sender.balance < amount) {
    throw new NotEnoughCoinsError()
  }

  sender.balance -= amount
  sender = await sender.save()

  receiver.balance += amount
  receiver = await receiver.save()
}

function isMinter(user: User) {
  // Check if minter
  return [249626104, 76104711, 80523220].indexOf(user.chatId) > -1
}

async function mint(user: User, amount: number) {
  user.balance += amount
  return user.save()
}

async function checkTransfer(ctx: ContextMessageUpdate) {
  // Get number of coins to send
  const amount = (ctx.message.text.match(/\+/g) || []).length
  // Check amount
  if (!amount) return
  // Get sender
  let sender = await getUser(ctx.from.id)
  // Get receiver
  const receiver = await getUser(ctx.message.reply_to_message.from.id)

  try {
    const senderIsMinter = isMinter(sender)
    if (senderIsMinter) {
      sender = await mint(sender, amount)
    }
    await transfer(sender, receiver, amount)

    // Get receiver member
    const receiverMember = await ctx.telegram.getChatMember(ctx.chat.id, receiver.chatId)
    const receiverName = getName(receiverMember)
    // Reply
    const text = senderIsMinter ?
      `*${amount}* Мемкоинов было выдано гаражанину *${receiverName}*` :
      `*${amount}* Мемкоинов было переведено гаражанину *${receiverName}*`
    await ctx.replyWithMarkdown(text, {
      reply_to_message_id: ctx.message.message_id,
    })
  } catch (err) {
    await ctx.reply(err.message, {
      reply_to_message_id: ctx.message.message_id,
    })
    return
  }
}