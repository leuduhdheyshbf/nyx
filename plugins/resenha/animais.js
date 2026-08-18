const animais = {
  'cachorro': '🐕 Au au!',
  'gato': '🐱 Miau!',
  'vaca': '🐄 Muuu!',
  'ovelha': '🐑 Bééé!',
  'galinha': '🐔 Có có!',
  'cavalo': '🐴 Hiin in in!',
  'pato': '🦆 Quack quack!',
  'sapo': '🐸 Coax!',
  'leão': '🦁 Rooaaar!',
  'lobo': '🐺 Auuuu!'
}
module.exports = {
  name: 'animais',
  description: 'Som de animal',
  category: 'resenha',
  aliases: ['animal', 'bicho'],
  async execute({ reply, args }) {
    const animal = (args[0] || '').toLowerCase()
    if (!animal || !animais[animal]) {
      return reply(`🐾 *ANIMAIS DISPONÍVEIS*\n\n${Object.keys(animais).join(', ')}\n\nUse: !animais [animal]`)
    }
    await reply(`${animais[animal]}`)
  }
}
