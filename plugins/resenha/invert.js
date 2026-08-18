module.exports = {
  name: 'invert',
  description: 'Inverte o texto',
  category: 'resenha',
  aliases: ['reverso'],
  async execute({ reply, q }) {
    if (!q) return reply('❗ Use: !invert [texto]')
    const invertido = q.split('').reverse().join('')
    await reply(`🔄 *Invertido:*\n${invertido}`)
  }
}
