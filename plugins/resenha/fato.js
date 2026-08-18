const fatos = [
  'O coração de uma pessoa bate cerca de 100.000 vezes por dia! ❤️',
  'Os elefantes são os únicos mamíferos que não podem pular! 🐘',
  'A água do mar é salgada porque contém sais minerais! 🌊',
  'O cérebro humano é 60% gordura! 🧠',
  'As abelhas têm 5 olhos! 🐝',
  'O bambu pode crescer até 1 metro em um único dia! 🎋',
  'Os gatos têm 32 músculos em cada orelha! 🐱',
  'O pinguim macho choca o ovo enquanto a fêmea procura comida! 🐧'
]
module.exports = {
  name: 'fato',
  description: 'Fato curioso',
  category: 'resenha',
  aliases: ['curiosidade'],
  async execute({ reply }) {
    await reply(`🧐 *Fato Curioso*\n\n${fatos[Math.floor(Math.random() * fatos.length)]}`)
  }
}
