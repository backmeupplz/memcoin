// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User, getUser } from '../models/user'
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

export class ErrorTransfer extends Error {
  type = 'ErrorNotEnotherCoins'
  message = 'Похоже, произошла ошибка при переводе средств'
}

export class ErrorNotEnotherCoins extends ErrorTransfer {
  type = 'ErrorNotEnotherCoins'
  message = 'Сорямба, у тебя недостаточно Мемкоинов на этот перевод'
}

export class ErrorSendSelf extends ErrorTransfer {
  type = 'ErrorSendSelf'
  message = `*Во имя Мемриарха*, астанавись! Сам себе коины тут кидаешь, мне работать нужно, а ведь у меня обед скоро! А ну, *пшел вон, пес*!`
}

export async function transfer(sender: User, receiver: User, amount: number) {
  // Check if user not send for self
  if (receiver.chatId === sender.chatId) {
    throw new ErrorSendSelf()
  }

  // Check if enough balance
  if (sender.balance < amount) {
    throw new ErrorNotEnotherCoins()
  }

  sender.balance -= amount
  sender = await sender.save()

  receiver.balance += amount
  receiver = await receiver.save()
}



class ErrorIsNotMinter extends Error {}

function isMinter(user: User) {
  // Check if minter
  return [249626104, 76104711, 80523220].indexOf(user.chatId) > -1
}

async function mint(user: User, amount: number) {
  // Check if user not send for self
  if (!isMinter(user)) {
    throw new ErrorIsNotMinter()
  }

  user.balance += amount
  return user.save()
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
  // Get receiver
  let receiver = await getUser(ctx.message.reply_to_message.from.id)

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
  } catch(err) {
    if (err instanceof ErrorTransfer) {
      await ctx.reply(err.message, {
        reply_to_message_id: ctx.message.message_id,
      })
      return
    }
  }
}