module.exports = {
  name: 'ship',
  description: 'Shippa duas pessoas',
  category: 'resenha',
  aliases: ['shippar', 'casal'],
  async execute({ nyx, from, info, reply, reagir, args, groupMembers, sender }) {
    try {
      await reagir('💕')
      const quoted = info.message?.extendedTextMessage?.contextInfo
      let p1 = quoted?.mentionedJid?.[0]
      let p2 = quoted?.mentionedJid?.[1]

      if (!p1) {
        const members = (groupMembers || []).map(m => m.id || m).filter(Boolean)
        if (members.length < 2) return reply('❗ Marque 2 pessoas ou use em grupo.')
        p1 = members[Math.floor(Math.random() * members.length)]
        p2 = members[Math.floor(Math.random() * members.length)]
        while (p2 === p1) p2 = members[Math.floor(Math.random() * members.length)]
      }
      if (!p2) p2 = sender

      const pct = Math.floor(Math.random() * 101)
      let emoji = pct < 30 ? '💔' : pct < 60 ? '💛' : pct < 85 ? '💕' : '💖🔥'

      await nyx.sendMessage(from, {
        text: `💘 *SHIP*\n\n@${p1.split('@')[0]} + @${p2.split('@')[0]}\n\n${emoji} Compatibilidade: *${pct}%*`,
        mentions: [p1, p2]
      }, { quoted: info })
    } catch {
      reply('❌ Erro no ship.')
    }
  }
}
