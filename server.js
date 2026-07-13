const http = require('http')
const fs   = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3456

// Looks for animation HTML files in these folders, in order — an app repo's
// own served animations (frontend/public), a top-level public/ if this script
// sits inside the frontend itself, or an examples/ folder of standalone drafts
// not yet wired into any app. Copy this file into any app repo unchanged; it
// just needs one of these folders alongside it.
const DIRS = [
  path.join(__dirname, 'frontend', 'public'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'examples'),
]
const DEFAULT_FILE = 'reading-check.html'

function listHtmlFiles() {
  const found = []
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.html')) found.push(f)
    }
  }
  return found
}

function resolveFile(name) {
  for (const dir of DIRS) {
    const p = path.join(dir, name)
    if (fs.existsSync(p)) return p
  }
  return null
}

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

  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (req.method === 'GET' && url.pathname === '/') {
    const name = url.searchParams.get('file') || DEFAULT_FILE
    const file = resolveFile(name)
    if (!file) {
      const files = listHtmlFiles()
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(files.length
        ? `<p>No "${name}" found. Available: ${files.map(f => `<a href="/?file=${f}">${f}</a>`).join(', ')}</p>`
        : '<p>No animation HTML files found in public/ or examples/.</p>')
      return
    }
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) { res.writeHead(500); res.end('Error'); return }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(data)
    })
    return
  }

  if (req.method === 'GET' && url.pathname.endsWith('.html')) {
    const file = resolveFile(url.pathname.slice(1))
    if (!file) { res.writeHead(404); res.end('Not found'); return }
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) { res.writeHead(500); res.end('Error'); return }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(data)
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/save') {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      try {
        const payload = JSON.parse(body) // { file?: name, settings: { id: value, ... } } or bare { id: value, ... }
        const name = payload.file || url.searchParams.get('file') || DEFAULT_FILE
        const settings = payload.settings || payload
        const file = resolveFile(name)
        if (!file) { res.writeHead(404); res.end(JSON.stringify({ error: 'file not found' })); return }
        let src = fs.readFileSync(file, 'utf8')

        for (const [id, value] of Object.entries(settings)) {
          if (id === 'file') continue
          // Update input default value
          src = replaceInputVal(src, id, value)
          // Update CSS var if mapped
          if (CSS_VAR_MAP[id]) {
            const unit = CSS_UNITS[id] || ''
            src = replaceCSSVar(src, CSS_VAR_MAP[id], value + unit)
          }
        }

        fs.writeFileSync(file, src, 'utf8')
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
  console.log(`animation preview server → http://localhost:${PORT}`)
})
