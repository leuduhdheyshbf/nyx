const surpresas = [
  '🎁 Você ganhou um abraço virtual!',
  '🎉 Parabéns, você é incrível!',
  '✨ Uma estrela acabou de nascer!',
  '🌈 Arco-íris de felicidade para você!',
  '🎊 Você é especial!',
  '💖 Alguém te ama!'
]
module.exports = {
  name: 'surpresa',
  description: 'Comando surpresa!',
  category: 'resenha',
  aliases: ['presente', 'gift'],
  async execute({ reply }) {
    await reply(`🎉 *SURPRESA!*\n\n${surpresas[Math.floor(Math.random() * surpresas.length)]}`)
  }
}
