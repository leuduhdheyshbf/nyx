module.exports = {
  name: 'sorteio',
  description: 'Sorteia um número',
  category: 'resenha',
  aliases: ['sortear'],
  async execute({ reply, args }) {
    const max = parseInt(args[0]) || 100
    const min = parseInt(args[1]) || 1
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    await reply(`🎲 Número sorteado: *${num}* (${min}-${max})`)
  }
}
