module.exports = {
  name: 'chute',
  description: 'Chuta alguém',
  category: 'resenha',
  aliases: ['chutar', 'kick'],
  async execute({ nyx, from, info, reply, reagir, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !chute @pessoa')
    if (typeof reagir === 'function') await reagir('🦶')
    await nyx.sendMessage(from, {
      text: `🦶 @${sender.split('@')[0]} chutou @${target.split('@')[0]}!`,
      mentions: [sender, target]
    })
  }
}
