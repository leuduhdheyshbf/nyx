const signos = {
  'áries': '🔥 Áries (21/03-19/04) - Hoje é dia de ação!',
  'aries': '🔥 Áries (21/03-19/04) - Hoje é dia de ação!',
  'touro': '🌍 Touro (20/04-20/05) - Foco na estabilidade.',
  'gêmeos': '💨 Gêmeos (21/05-21/06) - Comunicação em alta!',
  'gemeos': '💨 Gêmeos (21/05-21/06) - Comunicação em alta!',
  'câncer': '🌊 Câncer (22/06-22/07) - Emoções a flor da pele.',
  'cancer': '🌊 Câncer (22/06-22/07) - Emoções a flor da pele.',
  'leão': '🦁 Leão (23/07-22/08) - Protagonismo garantido!',
  'leao': '🦁 Leão (23/07-22/08) - Protagonismo garantido!',
  'virgem': '🧠 Virgem (23/08-22/09) - Organização e análise.',
  'libra': '⚖️ Libra (23/09-22/10) - Harmonia e equilíbrio.',
  'escorpião': '🦂 Escorpião (23/10-21/11) - Intensidade e mistério.',
  'escorpiao': '🦂 Escorpião (23/10-21/11) - Intensidade e mistério.',
  'sagitário': '🏹 Sagitário (22/11-21/12) - Aventura e otimismo.',
  'sagitario': '🏹 Sagitário (22/11-21/12) - Aventura e otimismo.',
  'capricórnio': '🐐 Capricórnio (22/12-19/01) - Disciplina e sucesso.',
  'capricornio': '🐐 Capricórnio (22/12-19/01) - Disciplina e sucesso.',
  'aquário': '💡 Aquário (20/01-18/02) - Inovação e originalidade.',
  'aquario': '💡 Aquário (20/01-18/02) - Inovação e originalidade.',
  'peixes': '🐟 Peixes (19/02-20/03) - Intuição e criatividade.'
}
module.exports = {
  name: 'horoscopo',
  description: 'Previsão do dia',
  category: 'resenha',
  aliases: ['signo', 'zodiaco'],
  async execute({ reply, args }) {
    const signo = (args[0] || '').toLowerCase()
    if (!signo || !signos[signo]) {
      return reply(`🌟 *HORÓSCOPO*\n\nSignos: áries, touro, gêmeos, câncer, leão, virgem, libra, escorpião, sagitário, capricórnio, aquário, peixes\n\nUse: !horoscopo [signo]`)
    }
    await reply(`🌟 *Horóscopo do dia*\n\n${signos[signo]}`)
  }
}
