module.exports = {
  name: 'sono',
  description: 'Nível de Sono',
  category: 'resenha',
  aliases: ['sonolento'],
  async execute({ reply, info, q }) {
    const menc = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    const nome = menc ? `@${menc.split('@')[0]}` : (q || 'Fulano(a)')
    const pct = Math.floor(Math.random() * 101)
    await reply(`😴 *Nível de Sono*\n${nome}: *${pct}%*`)
  }
}
