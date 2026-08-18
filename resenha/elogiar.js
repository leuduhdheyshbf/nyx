const elogios = [
  'Você é incrível! 🌟',
  'Seu sorriso ilumina o dia! ☀️',
  'Você é uma pessoa maravilhosa! 💖',
  'Sua energia é contagiante! ⚡',
  'Você é único(a)! 🌈',
  'Sua presença faz diferença! ✨',
  'Você é muito especial! 🎯',
  'Admiro sua força! 💪',
  'Sua bondade é inspiradora! 🌸',
  'Você é um presente na vida de quem te conhece! 🎁'
]

module.exports = {
  name: 'elogiar',
  description: 'Elogia alguém',
  category: 'resenha',
  aliases: ['elogio', 'compliment'],
  async execute({ reply, info, q }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    const nome = target ? `@${target.split('@')[0]}` : (q || 'você')
    const elogio = elogios[Math.floor(Math.random() * elogios.length)]
    await reply(`💝 *Elogio*\n\n${nome}, ${elogio}`)
  }
}
