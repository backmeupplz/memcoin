// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { IUser, getUser, getUserInfo } from '../models'
import { isReply } from './middleware'
import { transfer } from './transfer'

function isToxicMinisters(user: IUser) {
	// Check if ministers
	return [56778694].indexOf(user.chatId) > -1
  }

// Ministry of toxic commands
export function setupToxicCommand(bot: Telegraf<ContextMessageUpdate>) {
	bot.hears('prepareforkick', isReply, isToxicMinisters, checkAssets)
  }

async function checkAssets(ctx: ContextMessageUpdate) {
  // Get defendant
  const defendant = await getUser(ctx.message.reply_to_message.from.id)
  // Get defendant Info
  const defendantInfo = await getUserInfo(ctx.telegram, sender)
  // Get amount
  const amount = defendantInfo.balance
  if (!amount || amount <=0) return
  // Get bailiff
	const bailiff = await getUser(ctx.from.id)
	// Get bailiff Info
	const bailiffInfo = await getUserInfo(ctx.telegram, bailiff)
  try {
		// Transfer coins
		await transfer(defendant, bailiff, amount)
		// Reply
		const text = `Приставм *${bailiffInfo.name}* посетилм *${defendantInfo.name}* и избял у Гаражанина *${amount}* Мемкоинов. Теперб у нихм ${defendantInfo.balance} Мемкоинов.`
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