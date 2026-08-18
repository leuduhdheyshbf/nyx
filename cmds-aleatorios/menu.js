module.exports = {
  name: 'menu',
  description: 'Menu principal do bot',
  category: 'cmds-aleatorios',
  aliases: ['commands', 'ajuda', 'help'],
  async execute({ nyx, from, info, prefix }) {
    const IMAGE_URL = 'https://files.catbox.moe/mjxxwp.jpeg'
    const p = prefix || '.'

    const mensagem = `
╔══════════════════════╗
║     ⚔ 𝗡𝗬𝗫 𝗕𝗢𝗧 ⚔
║   ▸ DARK EDITION
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  📌 𝗨́𝗧𝗘𝗜𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
➤ ${p}sticker
➤ ${p}toimg
➤ ${p}ping
➤ ${p}dono

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
➤ ${p}play
➤ ${p}ytmp4
➤ ${p}tiktok
➤ ${p}instagram

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  ⚙️ 𝗔𝗗𝗠𝗜𝗡
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
➤ ${p}ban
➤ ${p}mute
➤ ${p}promover
➤ ${p}rebaixar
➤ ${p}link
➤ ${p}fechar
➤ ${p}abrir

════════════════════════
⚠️ 𝗨𝘀𝗲 ${p}𝗯𝗿𝗶𝗻𝗰𝗮𝗱𝗲𝗶𝗿𝗮𝘀
   𝗽𝗮𝗿𝗮 𝗼 𝗰𝗮𝗼𝘀 𝗲 𝗱𝗶𝘃𝗲𝗿𝘀𝗮̃𝗼
════════════════════════
`.trim()

    await nyx.sendMessage(from, {
      image: { url: IMAGE_URL },
      caption: mensagem
    }, { quoted: info })
  }
}
