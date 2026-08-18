const conselhos = [
  'Seja você mesmo, todo mundo já é alguém. 😉',
  'Não compare sua vida com a dos outros. 🌟',
  'Aprenda com os erros e siga em frente. 💪',
  'Sempre confie em seus instintos. 🧠',
  'Agradeça pelas pequenas coisas. 🙏',
  'Não tenha medo de mudar. 🔄',
  'Seja gentil com todos. 💕',
  'Acredite no seu potencial. 🚀'
]
module.exports = {
  name: 'conselho',
  description: 'Conselho aleatório',
  category: 'resenha',
  aliases: ['dica'],
  async execute({ reply }) {
    await reply(`💡 *Conselho*\n\n${conselhos[Math.floor(Math.random() * conselhos.length)]}`)
  }
}
