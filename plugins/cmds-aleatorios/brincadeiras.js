module.exports = {
  name: 'brincadeiras',
  description: 'Menu de jogos e diversão',
  category: 'cmds-aleatorios',
  aliases: ['jogos', 'diversao', 'fun', 'entretenimento', 'brinks', 'brincar'],
  async execute({ nyx, from, info, prefix }) {
    const IMAGE_URL = 'https://files.catbox.moe/mjxxwp.jpeg'
    const p = prefix || '.'

    const mensagem = `
╔══════════════════════╗
║   ☠ 𝗕𝗥𝗜𝗡𝗖𝗔𝗗𝗘𝗜𝗥𝗔𝗦 ☠
║   ▸ 𝗖𝗔𝗢𝗦 • 𝗗𝗜𝗩𝗘𝗥𝗦𝗔̃𝗢
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  🎲 𝗝𝗢𝗚𝗢𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}forca  • ${p}adivinha
• ${p}quiz  • ${p}velha
• ${p}memoria  • ${p}corrida
• ${p}ppt  • ${p}dado
• ${p}blackjack  • ${p}batalha

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  💕 𝗜𝗡𝗧𝗘𝗥𝗔𝗖̧𝗔̃𝗢
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}abraco  • ${p}beijo
• ${p}tapa  • ${p}chute
• ${p}morder  • ${p}carinho
• ${p}elogiar  • ${p}defender
• ${p}xingar  • ${p}provocar

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  📏 𝗠𝗘𝗗𝗜𝗗𝗢𝗥𝗘𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}gay  • ${p}corno  • ${p}burro
• ${p}feio  • ${p}lindo  • ${p}forte
• ${p}inteligente  • ${p}pobre
• ${p}rico  • ${p}alto
• ${p}gordo  • ${p}magro

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  🎲 𝗔𝗟𝗘𝗔𝗧𝗢́𝗥𝗜𝗢𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}cantada  • ${p}verdade
• ${p}escolha  • ${p}chance
• ${p}sorteio  • ${p}piada
• ${p}fato  • ${p}conselho
• ${p}8ball  • ${p}resposta

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  👥 𝗥𝗔𝗡𝗞𝗜𝗡𝗚𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}casal  • ${p}ship
• ${p}rankgay  • ${p}rankburro
• ${p}ranklindo  • ${p}rankforte
• ${p}rankcorno  • ${p}rankinteligente
• ${p}top10

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  🎭 𝗥𝗢𝗟𝗘𝗣𝗟𝗔𝗬
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}imitar  • ${p}animais
• ${p}robô  • ${p}bebê
• ${p}velho  • ${p}alien
• ${p}pirata  • ${p}celebridade

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  🌟 𝗘𝗫𝗧𝗥𝗔𝗦
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
• ${p}horoscopo  • ${p}signo
• ${p}magia  • ${p}energia
• ${p}surpresa  • ${p}invert
• ${p}espelho  • ${p}caixa
• ${p}zoeira  • ${p}numerologia

════════════════════════
🎉 𝗗𝗶𝘃𝗶𝗿𝘁𝗮-𝘀𝗲 𝗰𝗼𝗺 𝗡𝘆𝘅!
➤ 𝗨𝘀𝗲 ${p}𝗯𝗿𝗶𝗻𝗰𝗮𝗱𝗲𝗶𝗿𝗮𝘀
   𝗽𝗮𝗿𝗮 𝘃𝗲𝗿 𝗲𝘀𝘁𝗲 𝗺𝗲𝗻𝘂
════════════════════════
`.trim()

    await nyx.sendMessage(from, {
      image: { url: IMAGE_URL },
      caption: mensagem
    }, { quoted: info })
  }
}
