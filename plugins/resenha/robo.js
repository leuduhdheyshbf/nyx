module.exports = {
  name: 'robo',
  description: 'Fala como um robô',
  category: 'resenha',
  aliases: ['robô', 'robot'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || 'Olá humano'
    const robo = texto.split('').map(c => Math.random() > 0.7 ? c.toUpperCase() : c.toLowerCase()).join('')
    await reply(`🤖 *Robô:* ${robo}`)
  }
}
