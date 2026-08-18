module.exports = {
  name: 'jogos',
  description: 'Lista de jogos',
  category: 'resenha',
  aliases: ['games', 'brincadeiras'],
  async execute({ reply }) {
    await reply(`🎮 *JOGOS DISPONÍVEIS*\n\n!jogodavelha - Jogo da velha\n!adivinha - Adivinhe o número\n!quiz - Quiz\n!memoria - Jogo da memória\n!corrida - Corrida\n!blackjack - 21\n!batalha - Batalha naval\n!cacaniquel - Caça-níquel\n!loteria - Loteria\n!bingo - Bingo`)
  }
}
