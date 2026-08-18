const xingamentos = [
  'seu bobo alegre! 🤡',
  'seu lindo(a) atrapalhado(a)! 😂',
  'seu fofo(a) atentado(a)! 🥰',
  'seu(a) danado(a)! 😈',
  'seu(a) safado(a)! 😏',
  'seu(a) dengoso(a)! 💕',
  'seu(a) manhoso(a)! 😘',
  'seu(a) arteiro(a)! 🎨'
]

module.exports = {
  name: 'xingar',
  description: 'Xinga alguém de brincadeira',
  category: 'resenha',
  aliases: ['zoeira', 'zuar'],
  async execute({ reply, info, sender }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    const xingamento = xingamentos[Math.floor(Math.random() * xingamentos.length)]

    if (!target) {
      return reply(`😜 Você é ${xingamento}`)
    }

    await reply(`😂 @${String(sender).split('@')[0]} chamou @${target.split('@')[0]} de ${xingamento}`)
  }
}
