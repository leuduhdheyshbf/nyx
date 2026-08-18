module.exports = {
  name: 'morder',
  description: 'Morde alguém',
  category: 'resenha',
  aliases: ['mordida', 'bite'],
  async execute({ nyx, from, info, reply, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !morder @pessoa')
    await nyx.sendMessage(from, {
      text: `🦷 @${sender.split('@')[0]} mordeu @${target.split('@')[0]}!`,
      mentions: [sender, target]
    })
  }
}
