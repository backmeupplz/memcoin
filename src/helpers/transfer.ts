// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { IUser, getUser, getUserInfo } from '../models/user'
import { isReply } from './middleware'

export function setupTransfer(bot: Telegraf<ContextMessageUpdate>) {
  bot.hears(/./g, isReply, checkTransfer)
  bot.on('sticker', checkTransfer)
}

export class TransferError extends Error {
  type = 'TransferError'
  message = 'Произошла ошибка при переводе Лавкоинов'
}

export class NotEnoughCoinsError extends TransferError {
  type = 'NotEnoughCoinsError'
  message =
    'Прошу прощения, но у пользователя недостаточно Лавкоинов для этого перевода'
}

export class SendSelfError extends TransferError {
  type = 'SendSelfError'
  message = `*Во имя любви*, попробуйте лучше поделиться Лавкоинами с собеседниками!`
}

export async function transfer(sender: IUser, receiver: IUser, amount: number) {
  // Check if receiver is not the same as sender
  if (receiver.chatId === sender.chatId) throw new SendSelfError()
  // Check if enough balance
  if (sender.balance < amount) throw new NotEnoughCoinsError()
  // Remove balance from sender
  sender.balance -= amount
  sender = await sender.save()
  // Add balance to receiver
  receiver.balance += amount
  receiver = await receiver.save()
}

function isMinter(user: IUser) {
  // Check if minter
  return [249626104, 76104711, 80523220, 196846614].indexOf(user.chatId) > -1
}

async function mint(user: IUser, amount: number) {
  // Add balance to user
  user.balance += amount
  return user.save()
}

async function checkTransfer(ctx: ContextMessageUpdate) {
  // Check if sticker
  let amount = 0
  if (ctx.message && ctx.message.sticker) {
    console.log(ctx.message.sticker.emoji)
    if (ctx.message.sticker.emoji === '❤️') {
      amount = 1
    }
  } else {
    // Get number of coins to send
    amount = (ctx.message.text.match(/\+/g) || []).length
    const heartAmount = contains(ctx.message.text, '<3')
    const emojiAmount = contains(ctx.message.text, '❤️')
    amount = amount + heartAmount + emojiAmount
    // Check amount
    if (!amount) return
  }
  // Get sender
  let sender = await getUser(ctx.from.id)
  // Get receiver
  const receiver = await getUser(ctx.message.reply_to_message.from.id)
  try {
    // If minter, mint the coins first
    const senderIsMinter = isMinter(sender)
    if (senderIsMinter) {
      sender = await mint(sender, amount)
    }
    // Transfer coins
    await transfer(sender, receiver, amount)
    // Get receiver info
    const receiverInfo = await getUserInfo(ctx.telegram, receiver)
    // Reply
    const text = senderIsMinter
      ? `*${amount}* Лавкоинов было волшебным образом создано для *${
          receiverInfo.name
        }*. Всего у *${receiverInfo.name}* ${receiverInfo.balance} Лавкоинов.`
      : `*${amount}* Лавкоинов было подарено *${receiverInfo.name}*. Всего у *${
          receiverInfo.name
        }* ${receiverInfo.balance} Лавкоинов.`
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

function contains(str: string, substr: string) {
  return str.split(substr).length - 1
}
