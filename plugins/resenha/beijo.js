module.exports = {
  name: 'beijo',
  description: 'Beija alguém',
  category: 'resenha',
  aliases: ['kiss', 'beijar'],
  async execute({ nyx, from, info, reply, reagir, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: .beijo @pessoa')
    await reagir('💋')
    await nyx.sendMessage(from, {
      text: `💋 @${sender.split('@')[0]} beijou @${target.split('@')[0]}!`,
      mentions: [sender, target]
    }, { quoted: info })
  }
}
