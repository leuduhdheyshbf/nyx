/**
 * Plugin: Menu exclusivo do Dono
 * Pasta: plugins/dono/dono.js
 * Comandos: .dono | .owner | .painel | .adm
 */

module.exports = {
  name: 'dono',
  description: 'Menu de comandos exclusivos para o dono',
  category: 'dono',
  aliases: ['owner', 'painel', 'adm'],

  async execute({ nyx, from, info, prefix, reply, isDono, sender }) {
    // Segurança extra: só o dono pode ver o menu
    if (!isDono) {
      return reply('❌ Este comando é apenas para o dono do bot!')
    }

    const p = prefix || '.'

    const menu = `
╭─────────────────────────────╮
│  ❄️  *NYX — PAINEL DO DONO*  ❄️  │
╰─────────────────────────────╯

🧊 *GERENCIAMENTO DE GRUPOS*
│
├ ${p}ativar_grupo [ID] [dias]
│   ↳ Ativa o bot no grupo (padrão 30 dias)
├ ${p}reativar [ID] [dias]
│   ↳ Reativa grupo expirado
└ ${p}meuid
    ↳ Mostra o ID do chat atual

📋 *STATUS E LOGS*
│
├ ${p}status
│   ↳ Status atual do bot
└ ${p}logs
    ↳ Logs recentes do sistema

⚙️ *CONFIGURAÇÕES*
│
├ ${p}setprefix [novo_prefix]
│   ↳ Altera o prefixo global
└ ${p}setnome [novo_nome]
    ↳ Altera o nome do bot

🔄 *SISTEMA*
│
├ ${p}sair
│   ↳ Faz o bot sair do grupo atual
└ ${p}broadcast [mensagem]
    ↳ Envia mensagem para todos os grupos

💰 *PREMIUM*
│
├ ${p}addpremium [número]
│   ↳ Adiciona usuário premium
├ ${p}removepremium [número]
│   ↳ Remove usuário premium
└ ${p}listpremium
    ↳ Lista todos os premium

🔧 *TESTE / DEV*
│
├ ${p}restart
│   ↳ Reinicia o bot
└ ${p}eval <código>
    ↳ Executa código JavaScript
    ↳ (ou use > código / (> código)

╭─────────────────────────────╮
│  ⚠️  Uso exclusivo do dono   │
╰─────────────────────────────╯`.trim()

    await reply(menu)
  }
}
