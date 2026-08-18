module.exports = {
  name: 'alien',
  description: 'Fala como um alienígena',
  category: 'resenha',
  aliases: ['alienigena', 'et'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || 'Olá Terra'
    const alien = texto.split('').reverse().join('')
    await reply(`👽 *Alien:* ${alien}`)
  }
}
