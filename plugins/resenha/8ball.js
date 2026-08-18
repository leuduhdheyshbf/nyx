const respostas = [
  'Sim, definitivamente! ✅',
  'Não, nem pensar! ❌',
  'Melhor não te contar... 🤫',
  'Com certeza! 💯',
  'As chances são boas! 🎯',
  'Talvez... 🤔',
  'Não conte com isso. 😬',
  'Sim, mas não agora. ⏳',
  'Claro que sim! 🎉',
  'Isso é um mistério... 🔮'
]
module.exports = {
  name: '8ball',
  description: 'Bola 8 mágica',
  category: 'resenha',
  aliases: ['magic8', 'bola8'],
  async execute({ reply, q }) {
    if (!q) return reply('❓ Faça uma pergunta: !8ball [pergunta]')
    await reply(`🎱 *Bola 8 Mágica*\n\n${respostas[Math.floor(Math.random() * respostas.length)]}`)
  }
}
