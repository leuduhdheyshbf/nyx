const personagens = [
  { nome: 'Robô', prefixo: 'Beep boop! 🤖' },
  { nome: 'Bebê', prefixo: 'Buá buá! 👶' },
  { nome: 'Velho', prefixo: 'No meu tempo... 👴' },
  { nome: 'Pirata', prefixo: 'Arrr! 🏴‍☠️' },
  { nome: 'Alien', prefixo: 'Zzzziiip! 👽' }
]
module.exports = {
  name: 'imitar',
  description: 'Imita um personagem',
  category: 'resenha',
  aliases: ['personagem', 'imitação'],
  async execute({ reply, args }) {
    const personagem = personagens[Math.floor(Math.random() * personagens.length)]
    const texto = args.join(' ') || 'Olá!'
    await reply(`${personagem.prefixo}\n\n*${texto}*`)
  }
}
