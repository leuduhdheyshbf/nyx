module.exports = {
  name: 'beijar',
  description: 'Beija alguém',
  category: 'resenha',
  aliases: ['kiss2'],
  async execute({ nyx, from, info, reply, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !beijar @pessoa')
    await nyx.sendMessage(from, {
      text: `💋 @${sender.split('@')[0]} deu um beijo carinhoso em @${target.split('@')[0]}! 💋`,
      mentions: [sender, target]
    })
  }
}
