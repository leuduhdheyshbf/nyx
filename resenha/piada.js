const piadas = [
  'Qual o animal mais velho? O dinossauro, porque ele é "sauro" (sou velho) 🦕',
  'Por que o computador foi ao médico? Porque estava com vírus! 💻',
  'O que o tomate falou para o alface? Salada! 🥗',
  'Por que a galinha cruzou a estrada? Para chegar do outro lado! 🐔',
  'Qual o cúmulo do baixinho? É ficar em cima do muro! 🧱',
  'O que a vaca disse para o boi? Queijo! 🧀',
  'Por que o livro de matemática ficou triste? Porque tinha muitos problemas! 📚',
  'Qual o alimento mais perigoso? O pão, porque ele é "assassino"! 🍞'
]
module.exports = {
  name: 'piada',
  description: 'Conta uma piada',
  category: 'resenha',
  aliases: ['humor', 'risada'],
  async execute({ reply }) {
    await reply(`😂 ${piadas[Math.floor(Math.random() * piadas.length)]}`)
  }
}
