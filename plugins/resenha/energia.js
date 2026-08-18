module.exports = {
  name: 'energia',
  description: 'Nível de energia',
  category: 'resenha',
  aliases: ['power', 'vibes'],
  async execute({ reply, info, q }) {
    const menc = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    const nome = menc ? `@${menc.split('@')[0]}` : (q || 'Fulano(a)')
    const pct = Math.floor(Math.random() * 101)
    const emoji = pct > 70 ? '⚡' : pct > 40 ? '🔋' : '🪫'
    await reply(`⚡ *Nível de Energia*\n${nome}: *${pct}%* ${emoji}`)
  }
}
