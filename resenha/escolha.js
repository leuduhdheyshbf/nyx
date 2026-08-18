module.exports = {
  name: 'escolha',
  description: 'Escolhe entre opções',
  category: 'resenha',
  aliases: ['choose', 'ou'],
  async execute({ reply, q }) {
    if (!q || !q.includes(',')) return reply('❗ Use: .escolha pizza, sushi, burger')
    const ops = q.split(',').map(s => s.trim()).filter(Boolean)
    if (ops.length < 2) return reply('❗ Precisa de pelo menos 2 opções.')
    const pick = ops[Math.floor(Math.random() * ops.length)]
    await reply(`🎯 Eu escolho: *${pick}*`)
  }
}
