module.exports = {
  name: 'casal',
  description: 'Forma um casal aleatório do grupo',
  category: 'resenha',
  aliases: ['par'],
  async execute({ nyx, from, reply, reagir, isGroup, groupMembers }) {
    if (!isGroup) return reply('❌ Só em grupos.')
    const members = (groupMembers || []).map(m => m.id || m).filter(Boolean)
    if (members.length < 2) return reply('❌ Grupo pequeno.')
    await reagir('💑')
    let a = members[Math.floor(Math.random() * members.length)]
    let b = members[Math.floor(Math.random() * members.length)]
    while (b === a) b = members[Math.floor(Math.random() * members.length)]
    await nyx.sendMessage(from, {
      text: `💑 *Casal do momento*\n\n@${a.split('@')[0]} ❤️ @${b.split('@')[0]}`,
      mentions: [a, b]
    })
  }
}
