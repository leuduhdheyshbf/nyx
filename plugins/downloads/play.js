const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

function downloadUrl(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        try { fs.unlinkSync(dest) } catch {}
        return downloadUrl(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        try { fs.unlinkSync(dest) } catch {}
        return reject(new Error('HTTP ' + res.statusCode))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve(dest)))
    })
    req.on('error', (err) => {
      try { fs.unlinkSync(dest) } catch {}
      reject(err)
    })
  })
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile('yt-dlp', args, {
      timeout: 90000,
      maxBuffer: 5 * 1024 * 1024
    }, (err, stdout, stderr) => {
      if (err) {
        err.stderr = stderr
        return reject(err)
      }
      resolve({ stdout: (stdout || '').trim(), stderr: (stderr || '').trim() })
    })
  })
}

module.exports = {
  name: 'play',
  description: 'Toca musica do YouTube (modo rapido)',
  category: 'downloads',
  aliases: ['ytplay', 'musica'],
  async execute(ctx) {
    const sock = ctx.nyx || ctx.columbina || ctx.sock || null
    const { from, info, q, reply } = ctx

    if (!q) return reply('Digite o nome da musica!')
    if (!sock || typeof sock.sendMessage !== 'function') {
      return reply('Conexao do bot indisponivel. Reinicie o bot.')
    }

    const outputDir = path.resolve('./temp')
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    const cookiesPath = path.resolve('./cookies.txt')
    if (!fs.existsSync(cookiesPath)) {
      return reply('Arquivo cookies.txt nao encontrado na raiz do bot.')
    }

    const id = Date.now()
    const outBase = path.join(outputDir, 'play_' + id)

    try {
      await reply('Buscando: ' + q)

      // 1) Pega URL direta do audio (sem baixar ainda)
      // Formatos leves primeiro = arquivo menor = mais rapido
      let mediaUrl = ''
      try {
        const r = await runYtDlp([
          '-g',
          '--no-playlist',
          '--no-warnings',
          '--no-check-certificates',
          '--cookies', cookiesPath,
          '--extractor-args', 'youtube:player_client=android',
          '-f', '249/250/251/140/bestaudio/best',
          'ytsearch1:' + q
        ])
        mediaUrl = (r.stdout || '').split('\n').map(s => s.trim()).filter(Boolean)[0] || ''
      } catch (e1) {
        try {
          const r2 = await runYtDlp([
            '-g',
            '--no-playlist',
            '--no-warnings',
            '--no-check-certificates',
            '--cookies', cookiesPath,
            '-f', 'bestaudio/best',
            'ytsearch1:' + q
          ])
          mediaUrl = (r2.stdout || '').split('\n').map(s => s.trim()).filter(Boolean)[0] || ''
        } catch (e2) {
          console.error('[play] yt-dlp -g:', e2.message, e2.stderr)
          return reply('Nao achei essa musica / erro no yt-dlp.')
        }
      }

      if (!mediaUrl || !/^https?:\/\//i.test(mediaUrl)) {
        return reply('Nao consegui obter o link do audio.')
      }

      let ext = 'm4a'
      if (mediaUrl.includes('webm') || mediaUrl.includes('audio/webm')) ext = 'webm'
      else if (mediaUrl.includes('mp4') || mediaUrl.includes('m4a') || mediaUrl.includes('audio/mp4')) ext = 'm4a'
      else if (mediaUrl.includes('mp3')) ext = 'mp3'
      else if (mediaUrl.includes('opus')) ext = 'webm'

      const filePath = outBase + '.' + ext

      // 2) Download direto da URL
      try {
        await downloadUrl(mediaUrl, filePath)
      } catch (dlErr) {
        console.error('[play] download direto falhou:', dlErr.message)
        try {
          await runYtDlp([
            '--no-playlist',
            '--no-warnings',
            '--no-check-certificates',
            '--no-part',
            '--no-mtime',
            '--cookies', cookiesPath,
            '--extractor-args', 'youtube:player_client=android',
            '-f', '249/250/251/140/bestaudio/best',
            '-o', outBase + '.%(ext)s',
            'ytsearch1:' + q
          ])
        } catch (e3) {
          console.error('[play] fallback:', e3.message, e3.stderr)
          return reply('Erro ao baixar: ' + e3.message)
        }
      }

      let finalPath = filePath
      if (!fs.existsSync(finalPath)) {
        const files = fs.readdirSync(outputDir)
        const found = files.find(f => f.startsWith('play_' + id) && !f.endsWith('.part'))
        if (!found) return reply('Arquivo de audio nao encontrado.')
        finalPath = path.join(outputDir, found)
      }

      const buffer = fs.readFileSync(finalPath)
      if (!buffer.length) return reply('Audio vazio.')

      let mimetype = 'audio/mpeg'
      if (finalPath.endsWith('.m4a') || finalPath.endsWith('.mp4')) mimetype = 'audio/mp4'
      else if (finalPath.endsWith('.webm') || finalPath.endsWith('.opus') || finalPath.endsWith('.ogg')) {
        mimetype = 'audio/ogg; codecs=opus'
      }

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: mimetype,
        ptt: false
      }, { quoted: info })

      try { fs.unlinkSync(finalPath) } catch (e) {}
    } catch (err) {
      console.error('[play]', err)
      reply('Erro: ' + err.message)
    }
  }
}
