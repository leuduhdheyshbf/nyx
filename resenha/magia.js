const magias = [
  '✨ *Abracadabra!* Uma estrela cadente apareceu!',
  '🪄 *Puf!* Você virou um sapo!',
  '🔮 *Previsão:* Algo bom vai acontecer hoje!',
  '⭐ *Magia:* Seu desejo será realizado!',
  '🌙 *Lua mágica:* Energias positivas estão chegando!'
]
module.exports = {
  name: 'magia',
  description: 'Truque de mágica',
  category: 'resenha',
  aliases: ['magico', 'truque'],
  async execute({ reply }) {
    await reply(`🎩 ${magias[Math.floor(Math.random() * magias.length)]}`)
  }
}
