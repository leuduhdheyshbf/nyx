module.exports = {
  name: 'espelho',
  description: 'Espelha o texto',
  category: 'resenha',
  aliases: ['mirror'],
  async execute({ reply, q }) {
    if (!q) return reply('❗ Use: !espelho [texto]')
    const map = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z' }
    const espelho = q.split('').map(c => map[c.toLowerCase()] || c).reverse().join('')
    await reply(`🪞 *Espelhado:*\n${espelho}`)
  }
}
