module.exports = {
  name: 'defender',
  description: 'Defende alguém',
  category: 'resenha',
  aliases: ['proteger', 'defesa'],
  async execute({ nyx, from, info, reply, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !defender @pessoa')
    await nyx.sendMessage(from, {
      text: `🛡️ @${sender.split('@')[0]} defendeu @${target.split('@')[0]}!`,
      mentions: [sender, target]
    })
  }
}
