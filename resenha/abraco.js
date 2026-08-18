module.exports = {
  name: 'abraco',
  description: 'Abraça alguém',
  category: 'resenha',
  aliases: ['hug', 'abracar'],
  async execute({ nyx, from, info, reply, reagir, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    if (!target) return reply('❗ Marque alguém: .abraco @pessoa')
    await reagir('🤗')
    await nyx.sendMessage(from, {
      text: `🤗 @${sender.split('@')[0]} abraçou @${target.split('@')[0]}!`,
      mentions: [sender, target]
    }, { quoted: info })
  }
}
