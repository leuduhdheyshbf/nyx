module.exports = {
  name: 'velho',
  description: 'Fala como um velho',
  category: 'resenha',
  aliases: ['idoso', 'avô'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || 'Olá'
    await reply(`👴 *Velho:* No meu tempo... ${texto}`)
  }
}
