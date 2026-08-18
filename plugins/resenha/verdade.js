const verdades = [
  'Qual foi a coisa mais vergonhosa que você já fez?',
  'Qual seu maior medo?',
  'Já gostou de alguém do grupo?',
  'Qual mentira você conta com frequência?',
  'Qual seu sonho secreto?',
  'Já traiu a confiança de alguém?',
  'Qual música você escuta escondido?',
  'Já chorou por causa de série/anime?',
  'Qual seu crush famoso?',
  'Já se arrependeu de uma tatuagem ou corte de cabelo?'
]
const desafios = [
  'Mande um áudio cantando',
  'Fale uma cantada para alguém do grupo',
  'Troque a foto de perfil por 10 minutos',
  'Conte uma piada ruim',
  'Imite alguém do grupo',
  'Mande um sticker aleatório',
  'Fale o nome do seu crush (ou invente)',
  'Faça 10 polichinelos e filme',
  'Escreva só com a mão oposta a próxima msg',
  'Declare amor para o bot'
]

module.exports = {
  name: 'verdade',
  description: 'Verdade ou desafio',
  category: 'resenha',
  aliases: ['vod', 'desafio'],
  async execute({ reply, reagir, args }) {
    const tipo = (args[0]||'').toLowerCase()
    await reagir('🎲')
    if (tipo==='desafio' || tipo==='d') {
      return reply(`🔥 *DESAFIO*\n\n${desafios[Math.floor(Math.random()*desafios.length)]}`)
    }
    if (tipo==='verdade' || tipo==='v') {
      return reply(`💭 *VERDADE*\n\n${verdades[Math.floor(Math.random()*verdades.length)]}`)
    }
    const r = Math.random()<0.5
    if (r) reply(`💭 *VERDADE*\n\n${verdades[Math.floor(Math.random()*verdades.length)]}`)
    else reply(`🔥 *DESAFIO*\n\n${desafios[Math.floor(Math.random()*desafios.length)]}`)
  }
}
