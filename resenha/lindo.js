module.exports = {
  name: 'lindo',
  description: 'Medidor Lindo (zoação)',
  category: 'resenha',
  aliases: [],
  async execute({ reply, info, q }) {
    const menc = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    const nome = menc ? `@${menc.split('@')[0]}` : (q || 'Fulano(a)')
    const pct = Math.floor(Math.random() * 101)
    await reply(`✨ *Medidor Lindo*\n${nome}: *${pct}%*`)
  }
}
