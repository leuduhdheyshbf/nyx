module.exports = {
  name: 'cafeina',
  description: 'Nível de Cafeína',
  category: 'resenha',
  aliases: ['cafe'],
  async execute({ reply, info, q }) {
    const menc = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    const nome = menc ? `@${menc.split('@')[0]}` : (q || 'Fulano(a)')
    const pct = Math.floor(Math.random() * 101)
    await reply(`☕ *Nível de Cafeína*\n${nome}: *${pct}%*`)
  }
}
