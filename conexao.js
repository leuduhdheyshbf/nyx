/*
 * ============================================
 *  NYX BOT V1 - Base Oficial
 * ============================================
 *  Criador: LCSX
 *  Contato: +55 22998990549
 * ============================================
 *  Base focada em desempenho, organização
 *  e sistema de plugins.
 * ============================================
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const NodeCache = require('node-cache')
const readline = require('readline')
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const moment = require('moment')
const { CyanLog, GreenLog, RedLog, MagentaLog } = require('./arquivos/js/logger.js')

const msgRetryCounterCache = new NodeCache()
const groupCache = new NodeCache({ stdTTL: 300, useClones: false })
const AUTH_DIR = './database/Nyx-QR'

if (!fs.existsSync('./temp')) fs.mkdirSync('./temp', { recursive: true })
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync('./database/users')) fs.mkdirSync('./database/users', { recursive: true })
if (!fs.existsSync('./arquivos/json')) fs.mkdirSync('./arquivos/json', { recursive: true })
if (!fs.existsSync('./plugins')) {
for (const cat of ['admin', 'dono', 'cmds-aleatorios', 'resenha', 'downloads', 'efeitos', 'midias', 'inteligencia-ia', 'rpg', 'utilidades', 'adulto', 'premium']) {
fs.mkdirSync(`./plugins/${cat}`, { recursive: true })
}
}
// Arquivos JSON padrão usados pelos plugins (evita crash na primeira execução)
const defaultDbFiles = {
  './database/features.json': { antidelete: true, viewonce: true, antilink: false, antiflood: false },
  './database/xp.json': {},
  './database/warns.json': {},
  './database/mutes.json': {},
  './database/afk.json': {},
  './database/autoreply.json': {},
  './database/badwords.json': { enabled: {}, words: [] },
  './database/logs.json': []
}
for (const [file, def] of Object.entries(defaultDbFiles)) {
  if (!fs.existsSync(file)) {
    try { fs.writeFileSync(file, JSON.stringify(def, null, 2)) } catch {}
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

/*VARIAVEL PARA CONTROLAR REINICIALIZACAO*/
let isReconnecting = false
let reconnectTimer = null

async function startConnection(NucleoDeCmds, config) {

if (isReconnecting) {
CyanLog('🌸❄️Reconexão já em andamento, aguarde...')
return null
}

isReconnecting = true
  
const usePairingCode = process.argv.includes('--code')
const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
const { version } = await fetchLatestBaileysVersion()
const logger = pino({ level: 'silent' })

const nyx = makeWASocket({
version, logger,
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, logger)
},
printQRInTerminal: false,
browser: Browsers.ubuntu('Chrome'),
msgRetryCounterCache,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 60000,
keepAliveIntervalMs: 30000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
markOnlineOnConnect: false,
syncFullHistory: false,
shouldIgnoreJid: (jid) => jid?.includes('@broadcast') || jid?.includes('status@broadcast'),
cachedGroupMetadata: async (jid) => groupCache.get(jid),
getMessage: async (key) => {
return undefined
},
retryRequestDelayMs: 500,
maxMsgRetryCount: 3
})

if (usePairingCode && !state.creds.registered) {
let phoneNumber = await question('Digite o numero do WhatsApp no qual vc conectará a bot (com DDD, ex: 5512988047370):')
phoneNumber = phoneNumber.replace(/\D/g, '')
if (!phoneNumber || phoneNumber.length < 12) {
  console.log(colors.red('Numero invalido! Use formato tipo: 5512988047370'))
  process.exit(0)
}
console.log(colors.yellow(`Solicitando codigo para: ${phoneNumber}`))
let code = await nyx.requestPairingCode(phoneNumber)
code = code?.match(/.{1,4}/g)?.join('-') || code
console.log(colors.green(`Codigo de pareamento: ${code}`))
rl.close()
}

nyx.ev.on('creds.update', saveCreds)

nyx.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, qr } = update
if (qr && !usePairingCode) {
console.log(colors.yellow('QR Code gerado, escaneie com o WhatsApp:'))
const qrcode = require('qrcode-terminal')
qrcode.generate(qr, { small: true })
}

if (connection === 'open') {
GreenLog(`✅ ${config.NomeDoBot} conectado com sucesso!`)
const botNumber = nyx.user.id.split(':')[0]
GreenLog(`📱 Bot Numero: ${botNumber}`)
  
if (!fs.existsSync('./arquivos/json/welkon.json')) {
fs.writeFileSync('./arquivos/json/welkon.json', JSON.stringify([]))
}
if (!fs.existsSync('./arquivos/json/legendas.json')) {
fs.writeFileSync('./arquivos/json/legendas.json', JSON.stringify({}))
}
  
/*Reseta flag de reconexao quando conecta*/
isReconnecting = false
if (reconnectTimer) {
clearTimeout(reconnectTimer)
reconnectTimer = null
}
}

if (connection === 'close') {
const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
const reason = lastDisconnect?.error?.message || ''
RedLog(`Conexao fechada - Codigo: ${statusCode}${reason ? ' | ' + reason : ''}`)

// 515 = restart required (normal depois do QR) — reconecta rápido
// 408 = timeout — espera um pouco mais
// 405 = conflito / método — espera e reconecta
// loggedOut = precisa QR de novo

if (statusCode === DisconnectReason.loggedOut) {
  RedLog('🌸 Sessao expirada (loggedOut). Apague database/Nyx-QR e escaneie o QR de novo.')
  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(() => process.exit(0), 5000)
  return
}

let delay = 3000
if (statusCode === 515) {
  CyanLog('🔄 Codigo 515 (restart required) — reconectando...')
  delay = 2000
} else if (statusCode === 408) {
  CyanLog('⏳ Timeout (408) — aguardando 8s...')
  delay = 8000
} else if (statusCode === 405) {
  CyanLog('⚠️ Conflito/405 — feche o WhatsApp Web em outros lugares. Reconectando em 10s...')
  delay = 10000
} else if (statusCode === DisconnectReason.connectionReplaced) {
  RedLog('⚠️ Conexao substituida por outra sessao. Feche outras abas do WhatsApp Web.')
  delay = 15000
} else {
  RedLog(`🌸 Reiniciando em ${delay/1000}s (codigo ${statusCode})...`)
}

if (reconnectTimer) clearTimeout(reconnectTimer)
isReconnecting = false
reconnectTimer = setTimeout(() => {
  CyanLog('🌸 Encerrando processo para reconectar...')
  process.exit(0)
}, delay)
}
})

/*EVENTO DE GRUPO*/
nyx.ev.on('group-participants.update', async (update) => {
const { id, participants, action } = update

if (!fs.existsSync('./arquivos/json/welkon.json')) return
const welcomeGroups = JSON.parse(fs.readFileSync('./arquivos/json/welkon.json'))
if (!welcomeGroups.includes(id)) return

if (participants[0] === nyx.user.id?.split(':')[0]) return

let groupMetadata
try {
groupMetadata = await nyx.groupMetadata(id)
} catch (e) { return }

const legendasPath = './arquivos/json/legendas.json'

let legendas = {}
if (fs.existsSync(legendasPath)) {
legendas = JSON.parse(fs.readFileSync(legendasPath))
}

const legenda = legendas[id] || 'Bem-vindo(a) ao grupo!'

const part = participants[0]
const jid = part?.phoneNumber || part?.id || part?.jid
if (!jid) return
const numeroParticipante = jid.split("@")[0]

if (action === 'add') {
await nyx.sendMessage(id, {
image: { url: 'https://files.catbox.moe/mjxxwp.jpeg' },
caption: `╭᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╮
            𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼(𝗮):
@${numeroParticipante}!

*Legenda:* ${legenda}

╰᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╯`,
mentions: [jid]
})
} else if (action === 'remove') {
await nyx.sendMessage(id, {
image: { url: 'https://files.catbox.moe/9i38ij.jpeg' },
caption: `╭᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╮
            *SAYŌNARA*
@${numeroParticipante}

╰᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╯`,
mentions: [jid]
})
}
})

isReconnecting = false
return nyx
}

module.exports = startConnection