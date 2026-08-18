/**
 * Anti-Delete + View Once Saver
 * Salva mensagens em cache e recupera quando são apagadas.
 * Também detecta e reenvia mídia de visualização única.
 */

const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')
const path = require('path')

// Cache de mensagens (máx ~500 para não estourar memória)
const messageCache = new Map()
const MAX_CACHE = 500
const FEATURES_PATH = './database/features.json'

function isFeatureEnabled(name) {
  try {
    if (fs.existsSync(FEATURES_PATH)) {
      const data = JSON.parse(fs.readFileSync(FEATURES_PATH))
      return data[name] !== false
    }
  } catch {}
  return true // padrão: ligado
}

function cacheMessage(info) {
  try {
    if (!info?.key?.id) return
    const id = info.key.id
    // Não cacheia mensagens do próprio bot
    if (info.key.fromMe) return

    messageCache.set(id, {
      key: info.key,
      message: info.message,
      pushName: info.pushName || 'Usuário',
      timestamp: Date.now()
    })

    // Limpa cache antigo
    if (messageCache.size > MAX_CACHE) {
      const firstKey = messageCache.keys().next().value
      messageCache.delete(firstKey)
    }
  } catch (e) {}
}

function getCachedMessage(id) {
  return messageCache.get(id) || null
}

/**
 * Detecta se a mensagem é de visualização única
 */
function isViewOnce(msg) {
  if (!msg) return false
  return !!(
    msg.viewOnceMessage ||
    msg.viewOnceMessageV2 ||
    msg.viewOnceMessageV2Extension ||
    msg.ephemeralMessage?.message?.viewOnceMessage ||
    msg.ephemeralMessage?.message?.viewOnceMessageV2
  )
}

/**
 * Extrai o conteúdo real de uma mensagem view-once
 */
function unwrapViewOnce(msg) {
  if (!msg) return null
  if (msg.viewOnceMessage?.message) return msg.viewOnceMessage.message
  if (msg.viewOnceMessageV2?.message) return msg.viewOnceMessageV2.message
  if (msg.viewOnceMessageV2Extension?.message) return msg.viewOnceMessageV2Extension.message
  if (msg.ephemeralMessage?.message?.viewOnceMessage?.message) return msg.ephemeralMessage.message.viewOnceMessage.message
  if (msg.ephemeralMessage?.message?.viewOnceMessageV2?.message) return msg.ephemeralMessage.message.viewOnceMessageV2.message
  return msg
}

/**
 * Processa mensagem de visualização única e reenvia como normal
 */
async function handleViewOnce(nyx, info, from) {
  try {
    if (!isFeatureEnabled('viewonce')) return false
    if (!isViewOnce(info.message)) return false

    const realMsg = unwrapViewOnce(info.message)
    if (!realMsg) return false

    const mediaType = realMsg.imageMessage ? 'image' :
                      realMsg.videoMessage ? 'video' :
                      realMsg.audioMessage ? 'audio' : null

    if (!mediaType) return false

    // Baixa a mídia
    const mediaMsg = {
      key: info.key,
      message: realMsg
    }

    const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
    if (!buffer) return false

    const senderName = info.pushName || 'Alguém'
    const caption = `🔓 *Visu única salva!*\n👤 De: ${senderName}`

    if (mediaType === 'image') {
      await nyx.sendMessage(from, {
        image: buffer,
        caption
      }, { quoted: info })
    } else if (mediaType === 'video') {
      await nyx.sendMessage(from, {
        video: buffer,
        caption
      }, { quoted: info })
    } else if (mediaType === 'audio') {
      await nyx.sendMessage(from, {
        audio: buffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: info })
      await nyx.sendMessage(from, { text: caption }, { quoted: info })
    }

    return true
  } catch (e) {
    console.error('Erro ao salvar visu única:', e.message)
    return false
  }
}

/**
 * Detecta mensagem apagada (protocolMessage revoke)
 */
function isRevokeMessage(info) {
  const protocol = info.message?.protocolMessage
  if (!protocol) return false
  // type 0 = REVOKE
  return protocol.type === 0 || protocol.type === 'REVOKE'
}

/**
 * Processa mensagem apagada e reenvia o conteúdo
 */
async function handleAntiDelete(nyx, info, from) {
  try {
    // Só funciona em PV (chat privado), não em grupos
    if (from?.endsWith('@g.us')) return false

    if (!isFeatureEnabled('antidelete')) return false
    if (!isRevokeMessage(info)) return false

    const protocol = info.message.protocolMessage
    const deletedKey = protocol.key
    if (!deletedKey?.id) return false

    const cached = getCachedMessage(deletedKey.id)
    if (!cached) {
      // Mensagem não estava no cache (foi enviada antes do bot ligar)
      return false
    }

    const whoDeleted = info.pushName || info.key.participant || 'Alguém'
    const originalSender = cached.pushName || 'Usuário'
    const originalMsg = cached.message

    let textContent =
      originalMsg.conversation ||
      originalMsg.extendedTextMessage?.text ||
      originalMsg.imageMessage?.caption ||
      originalMsg.videoMessage?.caption ||
      ''

    // Texto
    if (textContent || originalMsg.conversation || originalMsg.extendedTextMessage) {
      const body = textContent || '[mensagem sem texto]'
      await nyx.sendMessage(from, {
        text: `🗑️ *Mensagem apagada!*\n\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor original: ${originalSender}\n\n💬 Conteúdo:\n${body}`
      })
      return true
    }

    // Imagem
    if (originalMsg.imageMessage) {
      try {
        const mediaMsg = { key: cached.key, message: originalMsg }
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        await nyx.sendMessage(from, {
          image: buffer,
          caption: `🗑️ *Foto apagada!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      } catch {
        await nyx.sendMessage(from, {
          text: `🗑️ *Foto apagada!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}\n\n⚠️ Não consegui recuperar a mídia.`
        })
      }
      return true
    }

    // Vídeo
    if (originalMsg.videoMessage) {
      try {
        const mediaMsg = { key: cached.key, message: originalMsg }
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        await nyx.sendMessage(from, {
          video: buffer,
          caption: `🗑️ *Vídeo apagado!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      } catch {
        await nyx.sendMessage(from, {
          text: `🗑️ *Vídeo apagado!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}\n\n⚠️ Não consegui recuperar a mídia.`
        })
      }
      return true
    }

    // Sticker
    if (originalMsg.stickerMessage) {
      try {
        const mediaMsg = { key: cached.key, message: originalMsg }
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        await nyx.sendMessage(from, { sticker: buffer })
        await nyx.sendMessage(from, {
          text: `🗑️ *Figurinha apagada!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      } catch {
        await nyx.sendMessage(from, {
          text: `🗑️ *Figurinha apagada!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      }
      return true
    }

    // Áudio
    if (originalMsg.audioMessage) {
      try {
        const mediaMsg = { key: cached.key, message: originalMsg }
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        await nyx.sendMessage(from, {
          audio: buffer,
          mimetype: 'audio/ogg; codecs=opus',
          ptt: !!originalMsg.audioMessage.ptt
        })
        await nyx.sendMessage(from, {
          text: `🗑️ *Áudio apagado!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      } catch {
        await nyx.sendMessage(from, {
          text: `🗑️ *Áudio apagado!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}`
        })
      }
      return true
    }

    // Fallback genérico
    await nyx.sendMessage(from, {
      text: `🗑️ *Mensagem apagada!*\n👤 Quem apagou: ${whoDeleted}\n✍️ Autor: ${originalSender}\n\n⚠️ Tipo de mensagem não suportado para recuperação.`
    })
    return true

  } catch (e) {
    console.error('Erro no anti-delete:', e.message)
    return false
  }
}

module.exports = {
  cacheMessage,
  getCachedMessage,
  isViewOnce,
  unwrapViewOnce,
  handleViewOnce,
  isRevokeMessage,
  handleAntiDelete
}
