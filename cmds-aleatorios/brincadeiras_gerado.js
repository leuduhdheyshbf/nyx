// plugins/cmds-aleatorios/brincadeiras_gerado.js
const { createCanvas } = require('canvas')

module.exports = {
  name: 'brincadeiras',
  description: 'Menu de brincadeiras com imagem dark',
  category: 'cmds-aleatorios',
  aliases: ['jogos', 'diversao', 'fun', 'entretenimento', 'brinks'],
  async execute({ nyx, from, info, prefix }) {
    const p = prefix || '.'

    try {
      const width = 800
      const height = 700
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let i = -height; i < width + height; i += 18) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + height, height)
        ctx.stroke()
      }

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.strokeRect(12, 12, width - 24, height - 24)
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 1
      ctx.strokeRect(22, 22, width - 44, height - 44)

      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 34px Sans-Serif'
      ctx.textAlign = 'center'
      ctx.fillText('DISTRACAO E JOGOS', width / 2, 65)

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(80, 85)
      ctx.lineTo(width - 80, 85)
      ctx.stroke()

      const drawCategory = (title, items, x, y) => {
        ctx.textAlign = 'left'
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 18px Sans-Serif'
        ctx.fillText(title, x, y)

        ctx.fillStyle = '#cfcfcf'
        ctx.font = '14px Sans-Serif'
        items.forEach((cmd, i) => {
          ctx.fillText(`> ${p}${cmd}`, x + 6, y + 24 + i * 20)
        })
      }

      drawCategory(
        'JOGOS',
        ['forca', 'adivinha', 'quiz', 'velha', 'memoria', 'corrida', 'ppt', 'dado', 'blackjack', 'batalha'],
        50,
        120
      )

      drawCategory(
        'INTERACAO',
        ['abraco', 'beijo', 'tapa', 'chute', 'morder', 'carinho', 'elogiar', 'defender', 'xingar', 'provocar'],
        420,
        120
      )

      drawCategory(
        'MEDIDORES',
        ['gay', 'corno', 'burro', 'feio', 'lindo', 'forte', 'inteligente', 'pobre', 'rico', 'alto', 'gordo', 'magro'],
        50,
        360
      )

      drawCategory(
        'ALEATORIOS',
        ['cantada', 'verdade', 'escolha', 'chance', 'sorteio', 'piada', 'fato', 'conselho', '8ball', 'resposta'],
        420,
        360
      )

      ctx.fillStyle = '#888888'
      ctx.font = '14px Sans-Serif'
      ctx.textAlign = 'right'
      ctx.fillText('Nyx Bot • Brincadeiras', width - 40, height - 35)

      const buffer = canvas.toBuffer('image/png')

      await nyx.sendMessage(from, {
        image: buffer,
        caption: `*BRINCADEIRAS*\nPrefixo: [ ${p} ]`
      }, { quoted: info })
    } catch (e) {
      console.error('[brincadeiras_gerado]', e)
      await nyx.sendMessage(from, {
        text: `Erro ao gerar menu.\nInstale: npm i canvas`
      }, { quoted: info })
    }
  }
}
