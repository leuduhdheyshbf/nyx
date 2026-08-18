const frases = [
  'A vida é uma jornada, não um destino. 🌟',
  'Seja a mudança que você quer ver no mundo. 🌍',
  'O sucesso é a soma de pequenos esforços repetidos dia após dia. 📈',
  'Acredite em você e tudo será possível. 💪',
  'A felicidade não é algo pronto, vem das suas próprias ações. 😊'
]
module.exports = {
  name: 'frase',
  description: 'Frase motivacional',
  category: 'resenha',
  aliases: ['motivacao', 'motivação'],
  async execute({ reply }) {
    await reply(`💭 *Frase do Dia*\n\n"${frases[Math.floor(Math.random() * frases.length)]}"`)
  }
}
