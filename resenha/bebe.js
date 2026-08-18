module.exports = {
  name: 'bebe',
  description: 'Fala como um bebê',
  category: 'resenha',
  aliases: ['bebê', 'baby'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || 'Olá'
    const bebe = texto.replace(/r/g, 'l').replace(/R/g, 'L')
    await reply(`👶 *Bebê:* ${bebe}`)
  }
}
