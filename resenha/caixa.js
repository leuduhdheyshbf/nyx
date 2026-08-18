module.exports = {
  name: 'caixa',
  description: 'Texto em caixa alta ou baixa',
  category: 'resenha',
  aliases: ['maiusculo', 'minusculo'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || ''
    if (!texto) return reply('❗ Use: !caixa [texto]')
    await reply(`🔠 *Caixa Alta:* ${texto.toUpperCase()}\n🔡 *Caixa Baixa:* ${texto.toLowerCase()}`)
  }
}
