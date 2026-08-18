module.exports = {
  name: 'aleatorio100',
  description: 'Número aleatório 1-100',
  category: 'resenha',
  aliases: ['random', 'rand'],
  async execute({ reply }) {
    const num = Math.floor(Math.random() * 100) + 1
    await reply(`🎲 Número aleatório: *${num}*`)
  }
}
