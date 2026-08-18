const fs = require('fs')

module.exports = {
  name: 'menu18',
  description: 'Menu +18 / adulto',
  category: 'cmds-aleatorios',
  aliases: ['+18', 'menu+18', 'nsfw', 'adulto'],
  async execute({ nyx, from, info, reply, prefix, pushname }) {
    const config = JSON.parse(fs.readFileSync('./database/config.json'))
    const botName = config.NomeDoBot || 'Nyx Bot'
    const p = prefix || config.prefix || '!'

    const menu = `
╔══════════════════════╗
║  🔞  ${botName.toUpperCase()}  🔞
║  ▸ MENU +18
╚══════════════════════╝

  👤 ${pushname || 'User'}
  ⚠️ Conteúdo adulto · +18

━━━━━━━━━━━━━━━━━━━━━━

┌─ 📥 DOWNLOADS +18
│  ${p}xxx <link>     Baixa vídeo free
│  ${p}xnxx <link>    Alias XNXX
│  ${p}xvideos <link> Alias XVideos
└─────────────────────

┌─ 🔥 IMAGENS NSFW
│  ${p}nsfw           Random NSFW
│  ${p}nsfw waifu     Waifu NSFW
│  ${p}nsfw neko      Neko NSFW
│  ${p}nsfw blowjob   Blowjob
│  ${p}nsfw trap      Trap
│  ${p}hentai         Hentai random
└─────────────────────

┌─ 🎲 DIVERSÃO +18
│  ${p}punheta        Contador zoação
│  ${p}gostosa @      % aleatória
│  ${p}pau @          Tamanho zoação
│  ${p}puta @         % aleatória
│  ${p}casal18        Ship +18
└─────────────────────

┌─ 📦 PACKS / LINKS
│  ${p}pack           Pack aleatório (links free)
│  ${p}only           Aviso OnlyFans (não baixa pago)
└─────────────────────

┌─ ℹ️ INFO
│  ${p}menu18         Este menu
│  ${p}menu           Menu principal
└─────────────────────

╔══════════════════════╗
║  🔞 Use com moderação
║  Só links públicos/free
╚══════════════════════╝

⚠️ *AVISO DE SEGURANÇA +18*
• Conteúdo adulto · apenas +18
• Não envie pra menores de idade
• Não compartilhe em grupo sem permissão
• Só use links públicos/free
• Não baixamos OnlyFans / conteúdo pago
• Risco de vírus em links desconhecidos
• Use por sua conta e responsabilidade
`
    try {
      await nyx.sendMessage(from, { text: menu }, { quoted: info })
    } catch {
      reply(menu)
    }
  }
}
