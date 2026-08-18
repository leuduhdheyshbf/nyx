module.exports = {
  name: 'tapa',
  description: 'Dá um tapa em alguém',
  category: 'resenha',
  aliases: ['slap'],
  async execute({ nyx, from, info, reply, reagir, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: .tapa @pessoa')
    await reagir('👋')
    await nyx.sendMessage(from, {
      text: `👋 @${sender.split('@')[0]} deu um tapa em @${target.split('@')[0]}!`,
      mentions: [sender, target]
    }, { quoted: info })
  }
}
