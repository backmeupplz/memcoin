import { ChatMember } from 'telegram-typings'

export function getName(member: ChatMember) {
  const user = member.user
  return `${user.username ? user.username : `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`}`
}