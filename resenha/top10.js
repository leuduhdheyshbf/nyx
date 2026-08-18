module.exports = {
  name: 'top10',
  description: 'Top 10 do grupo (ranking aleatório)',
  category: 'resenha',
  aliases: ['ranking', 'top'],
  async execute({ nyx, from, reply, isGroup, groupMembers }) {
    if (!isGroup) return reply('❌ Só em grupos.')
    const members = (groupMembers || []).map(m => m.id || m.jid || m).filter(Boolean)
    if (members.length < 3) return reply('❌ Grupo pequeno.')
    const shuffled = [...members].sort(() => Math.random() - 0.5).slice(0, 10)
    let text = '🏆 *TOP 10 DO GRUPO*\n\n'
    shuffled.forEach((id, i) => {
      text += `${i + 1}. @${String(id).split('@')[0]}\n`
    })
    await nyx.sendMessage(from, { text, mentions: shuffled })
  }
}
