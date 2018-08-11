// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User } from '../models/user';
import { getLeaderBalance } from '../models'
import { getName } from '../helpers/name'

interface UserForLeaderBoard {
    username: String,
    balance: Number,
}

const getUser = async (ctx: any, user: User): Promise<UserForLeaderBoard> => {
    const member = await ctx.telegram.getChatMember(user.chatId, user.chatId);
    return {
        username: getName(member),
        balance: user.balance,
    };
}

// Help commands
export function setupLeaderBoard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    const countUserInLeader = 10;
    // Get leaderboard users
    const users = await getLeaderBalance(ctx.from.id, countUserInLeader);
    // Get chat users
    const members = await Promise.all(users.map(user => getUser(ctx, user)));

    // Prepare leaderboard
    const list = members.map(member => `*${member.username}*: *${member.balance}*`).join('\n');
    // Prepare text
    const text = `🏆  Топ ${countUserInLeader} Мемолиархов 🏆\n\n${list}`;
    // Reply
    ctx.replyWithMarkdown(text)
  })
}