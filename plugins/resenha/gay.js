module.exports = {
  name: 'gay',
  description: 'Medidor gay (brincadeira)',
  category: 'resenha',
  aliases: ['gaymetro'],
  async execute({ nyx, from, info, reply, reagir, args, sender }) {
    await reagir('🏳️‍🌈')
    const quoted = info.message?.extendedTextMessage?.contextInfo
    let target = quoted?.participant || quoted?.mentionedJid?.[0] || sender
    if (args[0] && !quoted) target = args[0].replace(/\D/g, '') + '@s.whatsapp.net'
    const pct = Math.floor(Math.random() * 101)
    await nyx.sendMessage(from, {
      text: `🏳️‍🌈 @${target.split('@')[0]} é *${pct}%* gay`,
      mentions: [target]
    }, { quoted: info })
  }
}
