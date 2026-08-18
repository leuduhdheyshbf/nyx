module.exports = {
  name: 'pirata',
  description: 'Fala como um pirata',
  category: 'resenha',
  aliases: ['piratas'],
  async execute({ reply, args }) {
    const texto = args.join(' ') || 'Olá'
    await reply(`🏴‍☠️ *Pirata:* Arrr! ${texto} meu tesouro!`)
  }
}
