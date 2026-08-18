module.exports = {
  name: 'abracar',
  description: 'Abraça alguém',
  category: 'resenha',
  aliases: ['hug2'],
  async execute({ nyx, from, info, reply, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !abracar @pessoa')
    await nyx.sendMessage(from, {
      text: `🤗 @${sender.split('@')[0]} deu um abraço apertado em @${target.split('@')[0]}! 🤗`,
      mentions: [sender, target]
    })
  }
}
