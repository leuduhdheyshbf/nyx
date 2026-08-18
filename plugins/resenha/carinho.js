module.exports = {
  name: 'carinho',
  description: 'Faz carinho em alguém',
  category: 'resenha',
  aliases: ['afeto', 'cuddles'],
  async execute({ nyx, from, info, reply, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: !carinho @pessoa')
    await nyx.sendMessage(from, {
      text: `🤗 @${sender.split('@')[0]} fez carinho em @${target.split('@')[0]}!`,
      mentions: [sender, target]
    })
  }
}
