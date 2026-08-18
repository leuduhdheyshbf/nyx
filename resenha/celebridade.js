const celebridades = [
  { nome: 'Elon Musk', fala: 'Vamos colonizar Marte! 🚀' },
  { nome: 'Snoop Dogg', fala: 'Fumaaaando! 🌿' },
  { nome: 'Juliette', fala: 'Ai meu Deus! 🙏' },
  { nome: 'Gustavo Lima', fala: 'Modão! 🎵' },
  { nome: 'Lucas Neto', fala: 'Glória a Deus! 🙌' }
]
module.exports = {
  name: 'celebridade',
  description: 'Fala como uma celebridade',
  category: 'resenha',
  aliases: ['celebridades', 'famoso'],
  async execute({ reply }) {
    const celebridade = celebridades[Math.floor(Math.random() * celebridades.length)]
    await reply(`⭐ ${celebridade.nome}: "${celebridade.fala}"`)
  }
}
