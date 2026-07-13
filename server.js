const http = require('http')
const fs   = require('fs')
const path = require('path')

const FILE = path.join(__dirname, 'examples', 'reading-check.html')
const PORT = 3456

function replaceCSSVar(src, name, val) {
  return src.replace(new RegExp(`(${name.replace(/[-]/g,'\\$&')}:\\s*)[^;\\n]+`), `$1${val}`)
}

function replaceInputVal(src, id, val) {
  const escaped = id.replace(/[-]/g,'\\$&')
  // id before value
  src = src.replace(new RegExp(`(id="${escaped}"[^>]*?value=")[^"]*`), `$1${val}`)
  // value before id
  src = src.replace(new RegExp(`(value=")[^"]*("[^>]*?id="${escaped}")`), `$1${val}$2`)
  return src
}

const CSS_VAR_MAP = {
  'c-bg':      '--color-bg',
  'c-page':    '--color-page',
  'c-cover':   '--color-cover',
  'c-ink':     '--color-ink',
  'c-accent':  '--color-accent',
  'r-ibw':     '--ink-box-w',
  'r-ibh':     '--ink-box-h',
  'r-ibr':     '--ink-border-w',
  'r-ibc':     '--ink-border-r',
  'r-slide':   '--slide-dur',
  'r-flip':    '--flip-dur',
  'r-stamp':   '--stamp-fall-dur',
  'r-ink':     '--ink-dur',
}

const CSS_UNITS = {
  'r-ibw': 'px', 'r-ibh': 'px', 'r-ibr': 'px', 'r-ibc': 'px',
  'r-slide': 's', 'r-flip': 's', 'r-stamp': 's', 'r-ink': 's',
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/reading-check.html')) {
    fs.readFile(FILE, 'utf8', (err, data) => {
      if (err) { res.writeHead(500); res.end('Error'); return }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(data)
    })
    return
  }

  if (req.method === 'POST' && req.url === '/save') {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      try {
        const settings = JSON.parse(body) // { id: value, ... }
        let src = fs.readFileSync(FILE, 'utf8')

        for (const [id, value] of Object.entries(settings)) {
          // Update input default value
          src = replaceInputVal(src, id, value)
          // Update CSS var if mapped
          if (CSS_VAR_MAP[id]) {
            const unit = CSS_UNITS[id] || ''
            src = replaceCSSVar(src, CSS_VAR_MAP[id], value + unit)
          }
        }

        fs.writeFileSync(FILE, src, 'utf8')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  res.writeHead(404); res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`reading-check server → http://localhost:${PORT}`)
})
