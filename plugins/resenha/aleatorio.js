const palavras = [
  'Batata', 'Computador', 'Girafa', 'Abacaxi', 'Foguete',
  'Bicicleta', 'Chocolate', 'Dinossauro', 'Elefante', 'Futebol'
]
module.exports = {
  name: 'aleatorio',
  description: 'Palavra aleatória',
  category: 'resenha',
  aliases: ['palavra'],
  async execute({ reply }) {
    await reply(`🎲 Palavra aleatória: *${palavras[Math.floor(Math.random() * palavras.length)]}*`)
  }
}
