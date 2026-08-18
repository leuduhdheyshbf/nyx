const provocacoes = [
  'Achou que eu ia ficar calado? 😂',
  'Você é tão previsível! 🤭',
  'Sua cara é engraçada! 😅',
  'Você é o rei/rainha das zoeiras! 👑',
  'Tá com medo de perder? 😏',
  'Você é muito fácil de provocar! 😜',
  'Essa foi fraca, tenta de novo! 😂',
  'Você é o(a) mais zoado(a) do grupo! 🎯'
]

module.exports = {
  name: 'provocar',
  description: 'Provoca alguém',
  category: 'resenha',
  aliases: ['provocacao', 'provocação'],
  async execute({ reply, info }) {
    const quoted = info.message?.extendedTextMessage?.contextInfo
    const target = quoted?.participant || quoted?.mentionedJid?.[0]
    const provocacao = provocacoes[Math.floor(Math.random() * provocacoes.length)]

    if (!target) {
      return reply(`😈 ${provocacao}`)
    }

    await reply(`😜 @${target.split('@')[0]}, ${provocacao}`)
  }
}
