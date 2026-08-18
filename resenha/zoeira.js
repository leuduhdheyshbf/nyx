const zoacoes = [
  'Você é tão lerdo que... 🐢',
  'Seu QI é menor que... 🤏',
  'Você é a prova de que... 😂',
  'Até o bot te zoa! 🤖',
  'Você é tão fofo que parece... 🥰',
  'Seu nível de zoeira é... 🔥'
]
module.exports = {
  name: 'zoeira',
  description: 'Mensagem zoeira',
  category: 'resenha',
  aliases: ['zoar', 'troll'],
  async execute({ reply }) {
    await reply(`😜 *ZOEIRA*\n\n${zoacoes[Math.floor(Math.random() * zoacoes.length)]}`)
  }
}
