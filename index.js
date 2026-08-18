/*
 * ============================================
 *  NYX BOT V1 - Base Oficial
 * ============================================
 *  Criador: LCSX
 *  Contato: +55 22998990549
 * ============================================
 *  Esta base foi desenvolvida para facilitar
 *  a criação de bots WhatsApp com foco em
 *  desempenho, organização e plugins.
 * ============================================
 *  Ao utilizar esta base, mantenha os créditos
 *  ao criador original.
 * ============================================
 */

const fs = require('fs')
const path = require('path')
const colors = require('colors')
const moment = require('moment')
const { exec } = require('child_process')
const chokidar = require('chokidar')
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('./database/config.json'))
const GerenciadorDeCmds = require('./comandos.js')
const startConnection = require('./conexao.js')
const { AddWhatsAppuser, convertWhatsAppUser, getname } = require('./arquivos/js/userManager.js')
const { getGroupAdmins, getMembros, getPhoneNumberFromId, getMemberName, getFileBuffer, sleep, fetchJson, getRandom, addNumberMais, identArroba, inputToJid } = require('./arquivos/js/exports.js')
const { CyanLog, RedLog, GreenLog } = require('./arquivos/js/logger.js')
const { sendImageAsSticker2, sendVideoAsSticker2 } = require('./arquivos/js/exif2.js')
const { cacheMessage, handleViewOnce, handleAntiDelete, isRevokeMessage, isViewOnce } = require('./arquivos/js/antiDelete.js')

const gerenciadorComandos = new GerenciadorDeCmds()
gerenciadorComandos.carregarPlugins()

const donoJid = identArroba(config.NumeroDoDono)

let nyx = null

/*MONITORAMENTO DE ARQUIVOS CRÍTICOS (REINICIA O BOT)*/
const criticalFiles = [
  './index.js',
'./database/config.json',
'./conexao.js',
'./arquivos/js/exports.js',
'./comandos.js',
'./arquivos/js/userManager.js',
'./arquivos/js/logger.js',
'./arquivos/js/exif2.js'
]

const criticalWatcher = chokidar.watch(criticalFiles, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: true
})

criticalWatcher.on('change', (filePath) => {
  const fileName = path.basename(filePath)
  CyanLog(`❄️Arquivo critico alterado: ${fileName}`)
  CyanLog(`🌸 Reiniciando Nyx em 2 segundos para aplicar mudancas...`)

  if (nyx) {
    try {
      const donoId = donoJid || (nyx.user?.id?.split(':')[0] + '@s.whatsapp.net')
      nyx.sendMessage(donoId, {text: `🔄 *ARQUIVO CRITICO ALTERADO*\n\n📁 Arquivo: \`${fileName}\`\n⏰ Nyx sera reiniciada em 2 segundos.\n\n📌 Use \`sh start.sh\` ou \`sh start.sh cod\` para iniciar novamente.`
      }).catch(() => {})
    } catch(e) {}
  }

  setTimeout(() => {
    CyanLog(`🧊 Encerrando processo para reiniciar...`)
    process.exit(0)
  }, 2000)
})

criticalWatcher.on('add', (filePath) => {
  if (criticalFiles.includes(filePath)) {
    CyanLog(`📁 Arquivo crítico adicionado: ${path.basename(filePath)}`)
    setTimeout(() => process.exit(0), 2000)
  }
})

criticalWatcher.on('unlink', (filePath) => {
  if (criticalFiles.includes(filePath)) {
    CyanLog(`🗑️ Arquivo critico removido: ${path.basename(filePath)}`)
    setTimeout(() => process.exit(0), 2000)
  }
})

/*CHOKIDAR PARA PLUGINS*/
const watcher = chokidar.watch('./plugins', {
  persistent: true,
  ignoreInitial: true,
  depth: 99,
  awaitWriteFinish: true
})

watcher.on('add', (filePath) => {
  if (filePath.endsWith('.js')) {
    CyanLog(`📁 Plugin adicionado: ${path.basename(filePath)}`)
    Object.keys(require.cache).forEach(key => {
      if (key.includes(filePath)) delete require.cache[key]
    })
    gerenciadorComandos.carregarPlugins()
  }
})

watcher.on('change', (filePath) => {
  if (filePath.endsWith('.js')) {
    CyanLog(`📝 Plugin alterado: ${path.basename(filePath)}`)
    Object.keys(require.cache).forEach(key => {
      if (key.includes(filePath)) delete require.cache[key]
    })
    gerenciadorComandos.carregarPlugins()
  }
})

watcher.on('unlink', (filePath) => {
  if (filePath.endsWith('.js')) {
    CyanLog(`🗑️ Plugin removido: ${path.basename(filePath)}`)
    gerenciadorComandos.carregarPlugins()
  }
})

/*LOGS COLORIDOS*/
const logMessage = (type, data) => {
  const agora = new Date()
  const dataStr = agora.toLocaleDateString('pt-BR')
  const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const logTemplate = (nome, grupo, pv, comando, mensagem) => {
    const NomeColorido = `\x1b[34m${nome}\x1b[0m`
    const GrupoColorido = grupo ? `\x1b[32m${grupo}\x1b[0m` : ''
    const PvColorido = pv ? `\x1b[34mPV\x1b[0m` : ''
    const ComandoColorido = comando ? `\x1b[33m${comando}\x1b[0m` : ''
    const MensagemColorida = mensagem ? `\x1b[34m${mensagem}\x1b[0m` : ''
    const DataColorida = `\x1b[34m${dataStr}\x1b[0m`
    const HoraColorida = `\x1b[34m${horaStr}\x1b[0m`

    if (type === 'comando_grupo') {
      console.log(`
      ╭──────────────────᯽
      │🌕╭─────────────ᝰ
      │🌕│NOME: ${NomeColorido}
      │🌕│GRUPO: ${GrupoColorido}
      │🌕│COMANDO: ${ComandoColorido}
      │🌕│DATA: ${DataColorida}
      │🌕│HORA: ${HoraColorida}
      │🌕╰────────────ᝰ
      ╰──────────────────᯽`)
    } else if (type === 'comando_pv') {
      console.log(`
      ╭──────────────────᯽
      │🌕╭─────────────ᝰ
      │🌕│NOME: ${NomeColorido}
      │🌕│PV: ${PvColorido}
      │🌕│COMANDO: ${ComandoColorido}
      │🌕│DATA: ${DataColorida}
      │🌕│HORA: ${HoraColorida}
      │🌕╰────────────ᝰ
      ╰──────────────────᯽`)
    } else if (type === 'msg_grupo') {
      console.log(`
      ╭──────────────────᯽
      │🌕╭─────────────ᝰ
      │🌕│NOME: ${NomeColorido}
      │🌕│GRUPO: ${GrupoColorido}
      │🌕│MENSAGEM: ${MensagemColorida}
      │🌕│DATA: ${DataColorida}
      │🌕│HORA: ${HoraColorida}
      │🌕╰────────────ᝰ
      ╰──────────────────᯽`)
    } else if (type === 'msg_pv') {
      console.log(`
      ╭──────────────────᯽
      │🌕╭─────────────ᝰ
      │🌕│NOME: ${NomeColorido}
      │🌕│PV: ${PvColorido}
      │🌕│MENSAGEM: ${MensagemColorida}
      │🌕│DATA: ${DataColorida}
      │🌕│HORA: ${HoraColorida}
      │🌕╰────────────ᝰ
      ╰──────────────────᯽`)
    }
  }

  if (type === 'comando_grupo') {
    logTemplate(data.nome, data.grupo, null, data.comando, null)
  } else if (type === 'comando_pv') {
    logTemplate(data.nome, null, 'PV', data.comando, null)
  } else if (type === 'msg_grupo') {
    // desativado: spam em massa trava o bot
    return
  } else if (type === 'msg_pv') {
    // desativado: spam em massa trava o bot
    return
  }
}

const AudioNyx = async (source, quotedMsg, from) => {
  if (!nyx || !from) return
    try {
      if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
        let inputFile
        if (source.includes("http")) {
          const response = await axios({ url: source, method: 'GET', responseType: 'arraybuffer' })
          inputFile = `./temp/src_${Date.now()}.mp3`
          fs.writeFileSync(inputFile, response.data)
        } else {
          inputFile = path.resolve(source)
        }
        const outputFile = `./temp/voice_${Date.now()}.ogg`
        await new Promise((resolve, reject) => {
          exec(`ffmpeg -i "${inputFile}" -vn -c:a libopus -b:a 128k "${outputFile}"`, (err) => {
            if (err) return reject(err)
              resolve()
          })
        })
        const audioBuffer = fs.readFileSync(outputFile)
        await nyx.sendMessage(from, {audio: audioBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true}, {quoted: quotedMsg})
        if (inputFile.includes('./temp/') && fs.existsSync(inputFile)) fs.unlinkSync(inputFile)
          if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile)
    } catch (err) { RedLog(`AudioNyx error: ${err}`) }
}

const reagir = async (emj, from, info) => {
  if (!nyx || !from) return
    try {
      await nyx.sendMessage(from, {react: {text: emj, key: info.key}})
    } catch (e) {}
}

const reply = async (text, from, info) => {
  if (!nyx || !from) {
    RedLog('reply: sem nyx/from')
    return
  }
  try {
    await nyx.sendMessage(from, { text: String(text) }, { quoted: info })
  } catch (e1) {
    try {
      // tenta sem quoted (fromMe / LID as vezes quebra o quote)
      await nyx.sendMessage(from, { text: String(text) })
    } catch (e2) {
      RedLog('reply falhou: ' + (e2?.message || e2))
    }
  }
}

const enviar = reply

const mencionarIMG = async (teks, Url, ms, from, nyx) => {
  let memberr = []
  let vy = teks.includes('\n') ? teks.split('\n') : [teks]
  for (let vz of vy) {
    for (let zn of vz.split(' ')) {
      if (zn.includes('@')) memberr.push(identArroba(zn.split('@')[1]))
    }
  }
  await nyx.sendMessage(from, {image: {url: Url}, caption: teks.trim(), mentions: memberr}, {quoted: ms})
}

const getBotNumber = () => nyx?.user?.id?.split(':')[0] || ''

const isDono = (sender) => {
  const clean = (j) => String(j || '').split('@')[0].split(':')[0].replace(/\D/g, '')
  const senderNum = clean(sender)
  const botNum = clean(nyx?.user?.id)
  if (!senderNum) return false

    // Lista de números do dono (suporta string ou array no config)
    let donoList = []
    if (Array.isArray(config.NumeroDoDono)) {
      donoList = config.NumeroDoDono.map(n => clean(n)).filter(Boolean)
    } else {
      const n = clean(donoJid) || clean(config.NumeroDoDono)
      if (n) donoList.push(n)
    }
    // Também aceita o próprio bot como dono
    if (botNum) donoList.push(botNum)

      if (donoList.includes(senderNum)) return true

        // Fallback LID: tenta converter via userManager / convertWhatsAppUser
        try {
          if (String(sender || '').includes('@lid')) {
            const converted = convertWhatsAppUser(sender, 'jid')
            const convNum = clean(converted)
            if (convNum && donoList.includes(convNum)) return true
          }
        } catch {}

        return false
}

const isAdm = (sender, groupAdmins) => {
  if (isDono(sender)) return true
    return groupAdmins?.includes(sender) || false
}

process.on('uncaughtException', (err) => RedLog(`Uncaught Exception: ${err.message}`))
process.on('unhandledRejection', (reason) => RedLog(`Unhandled Rejection: ${reason}`))

async function processMessage(upsert, conn) {
  nyx = conn

  const isBotLigado = global.botLigado !== undefined ? global.botLigado : true

  const messages = upsert.messages
  const info = messages[0]

  if (!info.message) return

    const pushname = info.pushName || 'Usuário'
    const from = info.key.remoteJid || info.key.remoteJidAlt
    // Ignora status, canais e broadcasts
    if (!from || from === 'status@broadcast' || from.endsWith('@newsletter') || from.endsWith('@broadcast')) return
      let isGroup = from.endsWith('@g.us') // ✅ Corrigido: usa let
      const type = Object.keys(info.message)[0]

      // ===== ANTI-DELETE: detectar mensagem apagada =====
      if (isRevokeMessage(info)) {
        await handleAntiDelete(nyx, info, from)
        return
      }

      // ===== VIEW ONCE: salvar visu única =====
      if (isViewOnce(info.message)) {
        await handleViewOnce(nyx, info, from)
        // continua o fluxo normal também (caso tenha comando na caption)
      }

      // ===== Cache da mensagem (pra anti-delete funcionar) =====
      cacheMessage(info)

      const botNumber = getBotNumber()

      let prefix = config.prefix
      if (isGroup) {
        const groupPrefix = gerenciadorComandos.ObterPrefixoGrupo(from)
        if (groupPrefix) prefix = groupPrefix
      }

      // ContextInfo pode vir de vários tipos de mensagem (texto, imagem com caption, etc.)
      const ctxInfo =
      info.message?.extendedTextMessage?.contextInfo ||
      info.message?.imageMessage?.contextInfo ||
      info.message?.videoMessage?.contextInfo ||
      info.message?.documentMessage?.contextInfo ||
      info.message?.audioMessage?.contextInfo ||
      info.message?.buttonsResponseMessage?.contextInfo ||
      info.message?.listResponseMessage?.contextInfo ||
      info.message?.templateButtonReplyMessage?.contextInfo ||
      info.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo ||
      null
      const quotedMsg = ctxInfo?.quotedMessage || null
      const isQuotedSticker = !!quotedMsg?.stickerMessage
      const isQuotedImage = !!quotedMsg?.imageMessage
      const isQuotedVideo = !!quotedMsg?.videoMessage
      const isQuotedAudio = !!quotedMsg?.audioMessage
      const isQuotedDocument = !!quotedMsg?.documentMessage

      // ===== EXTRAÇÃO ROBUSTA DO TEXTO (suporta PV + LID + tipos novos) =====
      const getMessageBody = (msg) => {
        if (!msg) return ''
          try {
            // Mensagens efêmeras / view once / wrappers comuns
            const m = msg.ephemeralMessage?.message ||
            msg.viewOnceMessage?.message ||
            msg.viewOnceMessageV2?.message ||
            msg.viewOnceMessageV2Extension?.message ||
            msg.documentWithCaptionMessage?.message ||
            msg.templateMessage?.hydratedFourRowTemplate ||
            msg.templateMessage?.hydratedTemplate ||
            msg.editedMessage?.message ||
            msg

            return (
              m.conversation ||
              m.extendedTextMessage?.text ||
              m.imageMessage?.caption ||
              m.videoMessage?.caption ||
              m.documentMessage?.caption ||
              m.audioMessage?.caption ||
              m.buttonsResponseMessage?.selectedButtonId ||
              m.listResponseMessage?.singleSelectReply?.selectedRowId ||
              m.templateButtonReplyMessage?.selectedId ||
              m.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson && (() => {
                try {
                  const p = JSON.parse(m.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)
                  return p?.id || p?.selectedId || p?.title || ''
                } catch { return '' }
              })() ||
              m.protocolMessage?.editedMessage?.conversation ||
              m.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
              m.protocolMessage?.editedMessage?.imageMessage?.caption ||
              msg.conversation ||
              msg.extendedTextMessage?.text ||
              msg.imageMessage?.caption ||
              msg.videoMessage?.caption ||
              msg.documentMessage?.caption ||
              msg?.text ||
              ''
            )
          } catch {
            return ''
          }
      }

      let body = getMessageBody(info.message)
      const bodyOriginal = (body || '').trim()

      // Libera PV/comandos do proprio numero do bot (fromMe),
      // mas ignora mensagens comuns pra nao entrar em loop
      if (info.key?.fromMe) {
        if (!bodyOriginal || !bodyOriginal.startsWith(prefix)) return
      }

      const budy = bodyOriginal
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')

      // Remetente correto (sem usar conn.user.id, que quebrava o PV)
      let sender
      if (isGroup) {
        sender = info?.key?.participantAlt || info?.key?.participant || info?.key?.remoteJidAlt || info?.key?.remoteJid
      } else {
        // PV: se for fromMe, o "from" é o chat; senao o remoteJid e quem mandou
        if (info.key?.fromMe) {
          sender = (conn?.user?.id || '').split(':')[0] + '@s.whatsapp.net'
        } else {
          sender = info?.key?.remoteJidAlt || info?.key?.remoteJid || info?.key?.participantAlt || info?.key?.participant
        }
      }

      let groupMetadata = null
      let groupName = ''
      let groupDesc = ''
      let groupMembers = []
      let groupAdmins = []
      let somembros = []
      let isBotGroupAdmins = false
      let isGroupAdmins = false

      // Cache simples pra evitar rate-overlimit do WhatsApp
      if (!global.groupMetaCache) global.groupMetaCache = new Map()

        try {
          if (isGroup) {
            const cached = global.groupMetaCache.get(from)
            const now = Date.now()

            if (cached && (now - cached.time) < 5 * 60 * 1000) {
              // usa cache (5 minutos)
              groupMetadata = cached.data
            } else {
              try {
                groupMetadata = await nyx.groupMetadata(from)
                global.groupMetaCache.set(from, { data: groupMetadata, time: now })
              } catch (err) {
                // Se der rate-limit, tenta usar cache antigo mesmo expirado
                if (cached) {
                  groupMetadata = cached.data
                  CyanLog('⚠️ Usando cache antigo de grupo (rate-limit)')
                } else {
                  throw err
                }
              }
            }

            if (groupMetadata) {
              groupName = groupMetadata.subject || ''
              groupDesc = groupMetadata.desc || ''
              groupMembers = groupMetadata.participants || []
              groupAdmins = getGroupAdmins(groupMembers)
              somembros = getMembros(groupMembers)

              const botNumberPure = (botNumber || '').split('@')[0].replace(/[^0-9]/g, '')
              isBotGroupAdmins = groupAdmins.some(admin => {
                const adminPure = admin.toString().split('@')[0].replace(/[^0-9]/g, '')
                return adminPure === botNumberPure
              })

              const senderPure = (sender || '').split('@')[0].replace(/[^0-9]/g, '')
              isGroupAdmins = groupAdmins.some(admin => {
                const adminPure = admin.toString().split('@')[0].replace(/[^0-9]/g, '')
                return adminPure === senderPure
              })

              if (isDono(sender)) {
                isGroupAdmins = true
              }
            }
          }
        } catch (e) {
          // Não spamma o terminal com rate-overlimit
          if (!String(e?.message || e).includes('rate-overlimit')) {
            console.log('Erro ao pegar metadata do grupo:', e?.message || e)
          }
        }

        // ===== ANTILINK =====
        try {
          if (isGroup && !isGroupAdmins && isBotGroupAdmins) {
            const fs = require('fs')
            if (fs.existsSync('./database/features.json')) {
              const feats = JSON.parse(fs.readFileSync('./database/features.json'))
              if (feats.antilink) {
                const textCheck = (bodyOriginal || '').toLowerCase()
                const hasLink = /(https?:\/\/|www\.|wa\.me\/|t\.me\/|chat\.whatsapp\.com)/i.test(textCheck)
                if (hasLink) {
                  try {
                    await nyx.sendMessage(from, { delete: info.key })
                    await nyx.sendMessage(from, { text: '🔗 Link removido (antilink ativo).' })
                  } catch {}
                  return
                }
              }
            }
          }
        } catch {}

        // ===== MUTE: apaga msg de membros silenciados =====
        try {
          if (isGroup && !isGroupAdmins) {
            const fs = require('fs')
            if (fs.existsSync('./database/mutes.json')) {
              const mutes = JSON.parse(fs.readFileSync('./database/mutes.json'))
              if (mutes[from] && mutes[from].includes(sender)) {
                try { await nyx.sendMessage(from, { delete: info.key }) } catch {}
                return
              }
            }
          }
        } catch {}

        // ===== ANTIFLOOD =====
        try {
          if (isGroup && !isGroupAdmins) {
            const fs = require('fs')
            if (fs.existsSync('./database/features.json')) {
              const feats = JSON.parse(fs.readFileSync('./database/features.json'))
              if (feats.antiflood) {
                if (!global.floodMap) global.floodMap = new Map()
                  const key = `${from}_${sender}`
                  const now = Date.now()
                  const arr = global.floodMap.get(key) || []
                  const recent = arr.filter(t => now - t < 5000)
                  recent.push(now)
                  global.floodMap.set(key, recent)
                  if (recent.length >= 6) {
                    try { await nyx.sendMessage(from, { delete: info.key }) } catch {}
                    await nyx.sendMessage(from, { text: '🛡️ Flood detectado! Devagar.' })
                    return
                  }
              }
            }
          }
        } catch {}

        // ===== ANTI PALAVRA =====
        try {
          if (isGroup && !isGroupAdmins && bodyOriginal) {
            const fs = require('fs')
            if (fs.existsSync('./database/badwords.json')) {
              const bw = JSON.parse(fs.readFileSync('./database/badwords.json'))
              if (bw.enabled && bw.enabled[from] && Array.isArray(bw.words)) {
                const lower = bodyOriginal.toLowerCase()
                if (bw.words.some(w => w && lower.includes(w))) {
                  try { await nyx.sendMessage(from, { delete: info.key }) } catch {}
                  return
                }
              }
            }
          }
        } catch {}

        // ===== XP por mensagem (em memória + save a cada 30s pra não travar) =====
        try {
          if (isGroup && sender && !info.key.fromMe) {
            const fs = require('fs')
            const xpPath = './database/xp.json'
            if (!global.__xpData) {
              global.__xpData = {}
              try { if (fs.existsSync(xpPath)) global.__xpData = JSON.parse(fs.readFileSync(xpPath)) } catch {}
            }
            if (!global.__xpData[sender]) global.__xpData[sender] = { xp: 0, level: 1, msg: 0, daily: 0 }
            global.__xpData[sender].msg = (global.__xpData[sender].msg || 0) + 1
            global.__xpData[sender].xp += 1
            while (global.__xpData[sender].xp >= global.__xpData[sender].level * 100) {
              global.__xpData[sender].xp -= global.__xpData[sender].level * 100
              global.__xpData[sender].level++
            }
            const now = Date.now()
            if (!global.__xpLastSave || now - global.__xpLastSave > 30000) {
              global.__xpLastSave = now
              try { fs.writeFileSync(xpPath, JSON.stringify(global.__xpData)) } catch {}
            }
          }
        } catch {}

        // ===== AUTO-RESPOSTA =====
        try {
          if (isGroup && bodyOriginal && !bodyOriginal.startsWith(prefix)) {
            const fs = require('fs')
            if (fs.existsSync('./database/autoreply.json')) {
              const ar = JSON.parse(fs.readFileSync('./database/autoreply.json'))
              const map = ar[from] || {}
              const lower = bodyOriginal.toLowerCase()
              for (const [key, val] of Object.entries(map)) {
                if (key && lower.includes(key)) {
                  await reply(val, from, info)
                  break
                }
              }
            }
          }
        } catch {}

        // ===== AFK: volta se quem está AFK mandar msg =====
        try {
          const fs = require('fs')
          const afkPath = './database/afk.json'
          if (fs.existsSync(afkPath) && sender) {
            let afkData = {}
            try { afkData = JSON.parse(fs.readFileSync(afkPath)) } catch {}
            // se a pessoa que está AFK mandou mensagem (e não é comando .afk), tira o AFK
            if (afkData[sender] && !(bodyOriginal || '').toLowerCase().startsWith(prefix + 'afk')) {
              const since = afkData[sender].since || Date.now()
              const min = Math.floor((Date.now() - since) / 60000)
              delete afkData[sender]
              fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2))
              try {
                await nyx.sendMessage(from, {
                  text: `✅ @${sender.split('@')[0]} voltou! (esteve ausente ~${min} min)`,
                                            mentions: [sender]
                })
              } catch {}
            }
            // se alguém mencionou/respondeu pessoa AFK
            const ctx = info.message?.extendedTextMessage?.contextInfo
            const mentioned = ctx?.mentionedJid || []
            const quotedParticipant = ctx?.participant
            const targets = [...mentioned]
            if (quotedParticipant) targets.push(quotedParticipant)
              for (const t of targets) {
                if (afkData[t] && t !== sender) {
                  const motivo = afkData[t].motivo || 'Sem motivo'
                  const min = Math.floor((Date.now() - (afkData[t].since || Date.now())) / 60000)
                  await nyx.sendMessage(from, {
                    text: `💤 @${t.split('@')[0]} está *ausente* (AFK)\n📝 Motivo: ${motivo}\n⏱️ Há ~${min} min`,
                                              mentions: [t]
                  }, { quoted: info })
                }
              }
          }
        } catch {}

        await AddWhatsAppuser(nyx, info)

        /*SISTEMA DE EVAL*/

        if (
          budy.startsWith('>') &&
          !budy.startsWith('>>') &&
          !budy.startsWith('(>')
        ) {
          if (!isDono(sender)) return
            try {
              const evalCode = budy.slice(1).trim()
              if (!evalCode) return
                let result = eval(evalCode)
                if (result instanceof Promise) {
                  result = await result
                }
                let output =
                typeof result === 'object'
                ? JSON.stringify(result, null, 2)
                : String(result)
                if (output === undefined) output = 'undefined'
                  if (output === '') output = '(empty)'
                    await reply(output, from, info)
                    await reagir('✅', from, info)
            } catch (e) {
              await reply(e.stack || e.message, from, info)
              await reagir('❌', from, info)
            }
            return
        }

        if (budy.startsWith('(>')) {
          if (!isDono(sender)) return
            try {
              const evalCode = budy.slice(2).trim()
              if (!evalCode) return
                const asyncResult = await eval(`(async () => {
                  ${evalCode}
                })()`)
                if (asyncResult !== undefined) {
                  let output =
                  typeof asyncResult === 'object'
                  ? JSON.stringify(asyncResult, null, 2)
                  : String(asyncResult)
                  if (output === undefined) output = 'undefined'
                    if (output === '') output = '(empty)'
                      await reply(output, from, info)
                } else {
                  await reply('executado', from, info)
                }
                await reagir('✅', from, info)
            } catch (e) {
              await reply(e.stack || e.message, from, info)
              await reagir('❌', from, info)
            }
            return
        }
        /*FIM DO SISTEMA DE EVAL*/

        const isCommand = bodyOriginal.startsWith(prefix)

        if (isCommand) {
          CyanLog(`[CMD] "${bodyOriginal}" | fromMe=${!!info.key?.fromMe} | from=${from} | sender=${sender}`)
        }

        // ===== SÓ RESPONDE PRO NÚMERO AUTORIZADO / DONO =====
        // Sistema de permissões: Dono, Administradores, VIPs, Testadores e Apoiadores

        const numerosPermitidos = [
          // 👑 DONO DO BOT (Nível Máximo - Acesso Total)
          '5522998990549',  // LCSX / Criador
          '5491123141622',  // Novo número autorizado

          // ⚙️ ADMINISTRADORES (Podem usar comandos de admin, mesmo sem ser dono)
          '556198711355',  // Marcos 1
          '559484369410',  // Vitor 2
          '55',  // Admin 3

          // 💎 VIPs (Acesso a comandos premium e especiais)
          '55',  // VIP 1
          '55',  // VIP 2
          '55',  // VIP 3
          '55',  // VIP 4
          '55',  // VIP 5
          '55',  // VIP 6

          // 🧪 TESTADORES (Ajudam a testar comandos novos antes do lançamento)
          '55',  // Testador 1
          '55',  // Testador 2
          '55',  // Testador 3
          '55',  // Testador 4

          // 🤝 APOIADORES / PATROCINADORES (Acesso por apoio ao bot)
          '55',  // Apoiador 1
          '55',  // Apoiador 2
          '55',  // Apoiador 3
          '55',  // Apoiador 4
          '55',  // Apoiador 5

          // 🎯 EXTRAS / CONVIDADOS (Acesso temporário ou especial)
          '5522998238437',  // Kyara 1
          '5513981437004',  // Anny Gabrilly 2
          '559784183472',  // Manuh 3
          '5522992376950',  // Agatha 4
          '55',  // Convidado 5
          '55',  // Convidado 6
          '55',  // Convidado 7
          '55',  // Convidado 8
          '55',  // Convidado 9
          '55',  // Convidado 10
        ]

        // Limpa o número do remetente (remove @, :, letras, espaços e +)
        const senderNumClean = String(sender || '')
        .replace(/[^0-9]/g, '') // Remove TUDO que não é número

        // Função que verifica se o número está na lista (compara exatamente)
        const isNumeroAutorizado = (numero) => {
          if (!numero) return false
            // Remove tudo que não é número do número que você colocou na lista
            const numLimpo = String(numero).replace(/[^0-9]/g, '')
            return numerosPermitidos.some(autorizado => {
              const authLimpo = String(autorizado).replace(/[^0-9]/g, '')
              return numLimpo === authLimpo
            })
        }

        // Verifica se é permitido
        const permitido = (
          isDono(sender) ||                      // É o dono principal
          !!info.key?.fromMe ||                  // É o próprio bot
          isNumeroAutorizado(senderNumClean)     // Está na lista extra (VIPs, Admins, etc.)
        )
        // ===== BLOQUEIO DE GRUPO E PV =====
        // Verifica se é grupo (já foi declarado antes)
        isGroup = from.endsWith('@g.us'); // ✅ Corrigido: não tem 'const'

        // BLOQUEIO: Se for grupo E não for autorizado, ignore
        if (isGroup && !permitido) {
          return;
        }

        // BLOQUEIO: Se for PV E não for autorizado, ignore
        if (!isGroup && !permitido) {
          return;
        }

        // ============================================================
        // ===== SISTEMA DE EXPIRAÇÃO DE GRUPO (30 DIAS) ==============
        // ============================================================
        // Verifica se o grupo está ativo e dentro do prazo de validade.
        // Grupos não cadastrados ou expirados são bloqueados.
        // O dono sempre pode usar comandos (para poder reativar).
        // ============================================================
        try {
          if (isGroup) {
            const fsExp = require('fs')
            const pathExp = require('path')
            const groupsPath = pathExp.join(__dirname, 'database', 'groups.json')

            // Garante que o arquivo existe
            if (!fsExp.existsSync(groupsPath)) {
              try {
                const dir = pathExp.dirname(groupsPath)
                if (!fsExp.existsSync(dir)) fsExp.mkdirSync(dir, { recursive: true })
                fsExp.writeFileSync(groupsPath, JSON.stringify({}, null, 2))
              } catch {}
            }

            let groupsData = {}
            try {
              groupsData = JSON.parse(fsExp.readFileSync(groupsPath, 'utf8') || '{}')
            } catch {
              groupsData = {}
            }

            const groupInfo = groupsData[from]

            // Se o grupo NÃO está cadastrado ainda
            if (!groupInfo) {
              // Dono pode usar comandos mesmo sem cadastro (para ativar)
              if (!isDono(sender)) {
                await reply(
                  '🔒 Este grupo ainda não foi ativado.\n\n' +
                  'Peça ao dono do bot para ativar com o comando:\n' +
                  '`.ativar_grupo` (dentro do grupo) ou\n' +
                  '`.ativar_grupo ' + from + ' 30`',
                  from,
                  info
                )
                return
              }
              // Se for o dono, deixa passar para ele poder usar .ativar_grupo
            } else {
              // Grupo existe no banco — verifica status e expiração
              const agora = Date.now()
              let precisaSalvar = false

              // Se expirou, marca como inativo
              if (groupInfo.expires && groupInfo.expires < agora) {
                if (groupInfo.active !== false) {
                  groupInfo.active = false
                  groupsData[from] = groupInfo
                  precisaSalvar = true
                }
              }

              if (precisaSalvar) {
                try {
                  fsExp.writeFileSync(groupsPath, JSON.stringify(groupsData, null, 2))
                } catch {}
              }

              // Se estiver inativo ou expirado
              if (groupInfo.active === false || (groupInfo.expires && groupInfo.expires < agora)) {
                // Dono sempre pode usar (para reativar)
                if (!isDono(sender)) {
                  await reply(
                    '⏰ *Assinatura expirada!*\n\n' +
                    'O bot foi bloqueado neste grupo.\n' +
                    'Entre em contato com o dono para reativar.\n\n' +
                    'Comando do dono: `.reativar` ou `.reativar ' + from + ' 30`',
                    from,
                    info
                  )
                  return
                }
              }
            }
          }
        } catch (e) {
          // Em caso de erro no sistema de expiração, não trava o bot
          console.log('Erro no sistema de expiração de grupo:', e?.message || e)
        }
        // ============================================================
        // ===== FIM DO SISTEMA DE EXPIRAÇÃO ==========================
        // ============================================================

        // ===== COMANDO "." / REVELA VIEW ONCE =====
        let isDotCommand = bodyOriginal.trim() === '.' || bodyOriginal.trim() === '. '
        if (isDotCommand && permitido) {
          const dotPlugin =
            gerenciadorComandos.ObterComando('revela') ||
            gerenciadorComandos.ObterComando('salvarviewonce') ||
            gerenciadorComandos.ObterComando('.')
          if (dotPlugin) {
            try {
              await dotPlugin.execute({
                nyx,
                from,
                info,
                args: [],
                q: '',
                qOriginal: '',
                command: '.',
                prefix,
                reply: (text) => reply(text, from, info),
                reagir: (emj) => reagir(emj, from, info),
                sender,
                pushname,
                config
              })
            } catch (e) {
              RedLog('Erro no comando . : ' + (e?.message || e))
            }
          }
          return
        }

        if (isCommand) {
          CyanLog(`[OK] Comando autorizado: ${bodyOriginal} | sender=${senderNumClean} | fromMe=${!!info.key?.fromMe}`)
        }

        if (!isCommand) {
          if (isGroup) {
            logMessage('msg_grupo', {
              nome: pushname,
              grupo: groupName,
              mensagem: body.length > 50 ? body.substring(0, 50) + '...' : body
            })
          } else {
            logMessage('msg_pv', {
              nome: pushname,
              mensagem: body.length > 50 ? body.substring(0, 50) + '...' : body
            })
          }
          return
        }

        const fullCommand = bodyOriginal.slice(prefix.length)
        const args = fullCommand.split(' ')
        const command = (args.shift() || '').toLowerCase()
        const q = args.join(' ')
        let qOriginal = ''
        try {
          // Usa a mesma extração robusta
          const bodyForQ = getMessageBody(info.message) || bodyOriginal
          if (bodyForQ && bodyForQ.startsWith(prefix)) {
            const fullCommandOriginal = bodyForQ.slice(prefix.length)
            const argsOriginal = fullCommandOriginal.split(' ')
            argsOriginal.shift()
            qOriginal = argsOriginal.join(' ')
          }
        } catch(e) {
          qOriginal = q
        }

        /*LOG DE COMANDO*/
        if (isGroup) {
          logMessage('comando_grupo', {
            nome: pushname,
            grupo: groupName,
            comando: command
          })
        } else {
          logMessage('comando_pv', {
            nome: pushname,
            comando: command
          })
        }

        if (!isBotLigado && !isDono(sender)) {
          return reply('❄️Nyx esta desligada! Apenas o dono pode usar comandos.', from, info)
        }

        const targetPlugin = gerenciadorComandos.ObterComando(command)

        if (!targetPlugin) {

          // Sugestões por similaridade simples
          let sugestoes = []
          try {
            const all = gerenciadorComandos.ObterTodosComandos()
            .filter(c => !c.isAlias)
            .map(c => c.name)
            const cmd = (command || '').toLowerCase()
            sugestoes = all
            .filter(n => n.includes(cmd) || cmd.includes(n) || (cmd.length > 2 && n.startsWith(cmd.slice(0, 3))))
            .slice(0, 5)
          } catch {}

          await AudioNyx(
            './arquivos/audio/cmdinexistente.mp3',
            info,
            from
          ).catch(() => {})

          const listaSug = sugestoes.length
          ? `\n│ 🔎 Parecidos: ${sugestoes.map(s => prefix + s).join(', ')}`
          : ''

          await nyx.sendMessage(from, {
            image: { url: './arquivos/imagem/menu.jpg' },
            caption: `╭─「 *COMANDO INEXISTENTE* 」
            │
            │ 👤 User: @${pushname}
            │ ⭕ Comando: ${command || 'Nenhum'}
            │ 💡 Use: ${prefix}menu${listaSug}
            │
            ╰─────────────────`,
            mentions: [sender]
          }, { quoted: info })
          return
        }

        const isOwnerCmd = targetPlugin.category === 'dono'
        const isAdminCmd = targetPlugin.category === 'admin'
        const isResenhaCmd = targetPlugin.category === 'resenha'
        const isPremiumCmd = targetPlugin.category === 'premium'

        if (isOwnerCmd && !isDono(sender)) {
          return reply('🌸 Este comando é apenas para o dono do bot!', from, info)
        }

        if (isAdminCmd && !isGroup) {
          return reply('🧊 Este comando só pode ser usado em grupos!', from, info)
        }

        if (isAdminCmd && !isGroupAdmins && !isDono(sender)) {
          return reply('❄️ Este comando é apenas para administradores do grupo!', from, info)
        }

        if (isResenhaCmd && !gerenciadorComandos.ResenhaAtiva(from)) {
          return reply('🎐 O modo resenha não está ativo neste grupo!', from, info)
        }

        if (isPremiumCmd && !gerenciadorComandos.isPremium(sender, donoJid)) {
          return reply('🎐🧧 Este comando é apenas para usuarios premium!', from, info)
        }

        if (targetPlugin.needBotAdmin && !isBotGroupAdmins) {
          return reply('🌸🎐 Nyx precisa ser administradora do grupo para executar este comando!\n\nAdicione Nyx como ADMIN no grupo e tente novamente.', from, info)
        }

        try {
          const donoBool = isDono(sender)
          const admBool = !!(isGroupAdmins || donoBool)

          await targetPlugin.execute({
            nyx, from, info, args, q, qOriginal, command, prefix,
            reply: (text) => reply(text, from, info),
                                     enviar: (text) => reply(text, from, info),
                                     reagir: (emj) => reagir(emj, from, info),
                                     mencionarIMG: (teks, Url) => mencionarIMG(teks, Url, info, from, nyx),
                                     AudioNyx: (source) => AudioNyx(source, info, from),
                                     isGroup,
                                     isDono: donoBool,
                                     isAdm: admBool,
                                     isBotAdm: !!isBotGroupAdmins,
                                     sender, pushname, groupName, groupDesc, groupMembers, groupAdmins,
                                     botNumber, donoJid, getFileBuffer, sleep, fetchJson, getRandom,
                                     getMemberName, getPhoneNumberFromId, convertWhatsAppUser, getname,
                                     isQuotedSticker, isQuotedImage, isQuotedVideo, isQuotedAudio, isQuotedDocument,
                                     quotedMsg,
                                     commandManager: gerenciadorComandos, config, inputToJid
          })
        } catch (err) {
          RedLog(`Erro no comando ${command}: ${err.message}`)
          reply(`🧊 Erro ao executar comando: ${err.message}`, from, info)
        }
}

async function main() {
  nyx = await startConnection(gerenciadorComandos, config)

  if (!nyx) {
    RedLog('Vish pae, falha ao conectar')
    setTimeout(main, 5000)
    return
  }

  nyx.ev.on('messages.upsert', async (upsert) => {
    try {
      // Processa todos os tipos (notify, append, etc.)
      if (!upsert?.messages?.length) return
        await processMessage(upsert, nyx)
    } catch (e) {
      RedLog('Erro messages.upsert: ' + (e?.message || e))
      console.error(e)
    }
  })
}

main()
