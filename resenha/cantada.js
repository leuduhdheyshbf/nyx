const cantadas = [
  'Você é Wi-Fi? Porque sinto a conexão.',
  'Seu nome é Google? Porque você tem tudo que eu procuro.',
  'Não sou fotógrafo, mas posso te imaginar comigo.',
  'Você acredita em amor à primeira vista ou preciso passar de novo?',
  'Seu pai é ladrão? Porque ele roubou as estrelas e colocou nos seus olhos.',
  'Café ou chá? Porque eu quero um “nós”.',
  'Você é um empréstimo? Porque tem o meu interesse.',
  'Se a beleza fosse tempo, você seria a eternidade.',
  'Me passa seu WhatsApp? O daqui já tá cheio de saudade.',
  'Você é parkour? Porque pulou direto pro meu coração.'
]
module.exports = {
  name: 'cantada',
  description: 'Manda uma cantada',
  category: 'resenha',
  aliases: ['paquera'],
  async execute({ reply, reagir }) {
    await reagir('💘')
    reply(`💘 ${cantadas[Math.floor(Math.random()*cantadas.length)]}`)
  }
}
