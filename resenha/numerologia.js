module.exports = {
  name: 'numerologia',
  description: 'Número da sorte',
  category: 'resenha',
  aliases: ['numbers'],
  async execute({ reply, args }) {
    const nome = args.join(' ') || 'Fulano'
    const num = Math.floor(Math.random() * 100) + 1
    await reply(`🔢 *NÚMERO DA SORTE*\n\n${nome}, seu número da sorte é: *${num}*`)
  }
}
