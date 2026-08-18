module.exports = {
  name: 'confessar',
  description: 'Faz uma confissão anônima',
  category: 'resenha',
  aliases: ['confissão', 'anonimo'],
  async execute({ reply, q }) {
    if (!q) return reply('❗ Use: !confessar [sua confissão]')
    await reply(`🤫 *Confissão Anônima*\n\n"${q}"`)
  }
}
