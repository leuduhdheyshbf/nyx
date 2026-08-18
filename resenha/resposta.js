const respostas = [
  'Sim ✅', 'Não ❌', 'Talvez 🤔', 'Com certeza! 💯',
  'Melhor não... 😬', 'Claro que sim! 🎉', 'Absolutamente! 🏆',
  'Nem pensar! 😅', 'Pode ser... 🤷', 'Vai fundo! 🚀'
]
module.exports = {
  name: 'resposta',
  description: 'Resposta aleatória',
  category: 'resenha',
  aliases: ['oraculo', 'oráculo'],
  async execute({ reply, q }) {
    if (!q) return reply('❓ Faça uma pergunta: !resposta [pergunta]')
    await reply(`🔮 *Resposta:* ${respostas[Math.floor(Math.random() * respostas.length)]}`)
  }
}
