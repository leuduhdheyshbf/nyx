module.exports = {
  name: 'rankforte',
  description: 'TOP 5 FORTES DO GRUPO',
  category: 'resenha',
  aliases: ['topforte'],
  async execute({ nyx, from, reply, reagir, isGroup, groupMembers }) {
    if (!isGroup) return reply('❌ Só em grupos.')
    const members = (groupMembers || []).map(m => m.id || m.jid || m).filter(Boolean)
    if (members.length < 3) return reply('❌ Grupo pequeno.')
    if (typeof reagir === 'function') await reagir('💪')
    const shuffled = [...members].sort(() => Math.random() - 0.5).slice(0, 5)
    let text = '💪 *TOP 5 FORTES DO GRUPO*\n\n'
    shuffled.forEach((id, i) => {
      text += `${i + 1}. @${String(id).split('@')[0]} — ${Math.floor(Math.random() * 40) + 60}%\n`
    })
    await nyx.sendMessage(from, { text, mentions: shuffled })
  }
}
