module.exports = {
  name: 'chance',
  description: 'Chance de algo acontecer',
  category: 'resenha',
  aliases: ['probabilidade'],
  async execute({ reply, q }) {
    if (!q) return reply('❗ Use: .chance eu ganhar na mega')
    const pct = Math.floor(Math.random() * 101)
    await reply(`🔮 A chance de *${q}* é *${pct}%*`)
  }
}
