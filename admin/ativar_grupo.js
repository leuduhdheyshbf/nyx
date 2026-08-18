const fs = require('fs')
const path = require('path')

const GROUPS_PATH = path.join(__dirname, '../../database/groups.json')

function loadGroups() {
  try {
    if (!fs.existsSync(GROUPS_PATH)) {
      fs.writeFileSync(GROUPS_PATH, JSON.stringify({}, null, 2))
      return {}
    }
    return JSON.parse(fs.readFileSync(GROUPS_PATH, 'utf8'))
  } catch (e) {
    return {}
  }
}

function saveGroups(data) {
  try {
    const dir = path.dirname(GROUPS_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(GROUPS_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (e) {
    return false
  }
}

function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

module.exports = {
  name: 'ativar_grupo',
  aliases: ['ativar'],
  description: 'Ativa o bot em um grupo por X dias (padrão 30). Apenas o dono.',
  category: 'admin',
  async execute({ nyx, from, info, args, q, reply, isDono, sender }) {
    if (!isDono) {
      return reply('🌸 Este comando é apenas para o dono do bot!')
    }

    // Aceita ID do grupo como argumento ou usa o chat atual se for grupo
    let groupId = (args[0] || '').trim()
    let dias = 30

    // Se o primeiro arg for número, pode ser dias (quando usado dentro do próprio grupo)
    if (groupId && /^\d+$/.test(groupId) && groupId.length < 15) {
      // Provavelmente é quantidade de dias, e estamos dentro do grupo
      if (from.endsWith('@g.us')) {
        dias = parseInt(groupId) || 30
        groupId = from
      }
    } else if (args[1]) {
      const parsed = parseInt(args[1])
      if (!isNaN(parsed) && parsed > 0) dias = parsed
    }

    // Se não passou ID e está em um grupo, usa o grupo atual
    if ((!groupId || !groupId.includes('@')) && from.endsWith('@g.us')) {
      groupId = from
    }

    // Normaliza ID (aceita com ou sem @g.us)
    if (groupId && !groupId.endsWith('@g.us') && !groupId.includes('@')) {
      groupId = groupId + '@g.us'
    }

    if (!groupId || !groupId.endsWith('@g.us')) {
      return reply(
        `📌 *Uso correto:*\n` +
        `• Dentro do grupo: ${info?.key ? '' : ''}.ativar_grupo [dias]\n` +
        `• Em qualquer lugar: .ativar_grupo <id_do_grupo> [dias]\n\n` +
        `Exemplo:\n` +
        `.ativar_grupo 1203630xxxxx@g.us 30\n` +
        `.ativar_grupo 45`
      )
    }

    if (dias < 1 || dias > 3650) {
      return reply('⚠️ Quantidade de dias inválida. Use entre 1 e 3650.')
    }

    const groups = loadGroups()
    const expires = Date.now() + (dias * 24 * 60 * 60 * 1000)

    groups[groupId] = {
      active: true,
      expires: expires,
      activatedAt: Date.now(),
      activatedBy: sender,
      days: dias
    }

    if (!saveGroups(groups)) {
      return reply('❌ Erro ao salvar no banco de dados. Verifique permissões da pasta database/.')
    }

    const dataExp = formatDate(expires)

    await reply(
      `✅ *Grupo ativado com sucesso!*\n\n` +
      `🆔 Grupo: \`${groupId}\`\n` +
      `📅 Dias: *${dias}*\n` +
      `⏰ Expira em: *${dataExp}*\n\n` +
      `O bot responderá normalmente neste grupo até a data de expiração.`
    )
  }
}
