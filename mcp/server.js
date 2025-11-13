import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import urlLib from 'node:url'
import sharp from 'sharp'

function readAllowedThemes() {
  try {
    const dir = path.resolve(process.cwd(), 'src/components/cards')
    const files = fs.readdirSync(dir).filter(f => /Card\.tsx$/.test(f))
    const names = []
    for (const f of files) {
      const text = fs.readFileSync(path.join(dir, f), 'utf-8')
      const m = text.match(/name:\s*["']([^"']+)["']/)
      if (m && m[1]) names.push(m[1])
    }
    return names.length ? names : ['默认']
  } catch {
    return ['默认']
  }
}

const ALLOWED_THEMES = readAllowedThemes()

export function createMcpServer() {
  const server = new McpServer({
    name: 'md2card-mcp',
    version: '0.1.0'
  })

  server.registerTool(
  'generate-png',
  {
    title: '生成 PNG 图片',
    description: '输入 markdown 与主题名生成卡片 PNG',
    inputSchema: {
      markdown: z.string(),
      theme: z.string().refine(t => ALLOWED_THEMES.includes(t), {
        message: `theme must be one of: ${ALLOWED_THEMES.join(', ')}`
      })
    },
    outputSchema: {
      url: z.string().url()
    }
  },
  async ({ markdown, theme }) => {
    const baseUrl = process.env.MD2CARD_URL ?? 'http://localhost:5173/'
    const cardWidth = 440
    const cardHeight = 586
    const mode = '长卡片'

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    try {
      const page = await browser.newPage()

      await page.evaluateOnNewDocument((md, th, w, h, vm) => {
        try {
          localStorage.setItem(
            'editor-storage',
            JSON.stringify({ state: { content: md } })
          )
          localStorage.setItem(
            'settings1-storage',
            JSON.stringify({
              state: {
                cardWidth: w,
                cardHeight: h,
                viewMode: vm,
                hideOverflow: false,
                selectedTheme: th
              }
            })
          )
        } catch {}
      }, markdown, theme, cardWidth, cardHeight, mode)

      await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 })
      try {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' })
      } catch (e) {
        throw new Error(`无法打开页面: ${baseUrl}`)
      }

      await page.waitForSelector('#root', { timeout: 30000 })
      try {
        await page.waitForSelector('#preview', { timeout: 30000 })
      } catch {
        const exists = await page.evaluate(() => !!document.querySelector('#preview'))
        if (!exists) throw new Error(`未找到预览区域: ${baseUrl}`)
      }
      await page.waitForSelector('#preview .prose, #preview .card-content, #preview .paper', { timeout: 15000 })
      const el = (await page.$('#preview .prose')) || (await page.$('#preview .card-content')) || (await page.$('#preview .paper'))
      if (!el) {
        throw new Error('未找到卡片元素')
      }

      const box = await el.boundingBox()
      if (!box) throw new Error('无法获取卡片区域')
      const pad = 4
      const neededWidth = Math.max(1400, Math.ceil(box.x + box.width + pad))
      const neededHeight = Math.max(900, Math.ceil(box.y + box.height + pad))
      await page.setViewport({ width: neededWidth, height: neededHeight, deviceScaleFactor: 2 })
      const clip = { x: Math.max(0, Math.floor(box.x)), y: Math.max(0, Math.floor(box.y)), width: Math.ceil(box.width), height: Math.ceil(box.height) }
      const buf = await page.screenshot({ type: 'png', omitBackground: true, clip })
      const meta = await sharp(buf).ensureAlpha().metadata()
      const raw = await sharp(buf).ensureAlpha().raw().toBuffer()
      const w = meta.width ?? 0
      const h = meta.height ?? 0
      let top = 0
      const rowEmpty = (y) => {
        for (let x = 0; x < w; x++) {
          if (raw[(y * w + x) * 4 + 3] !== 0) return false
        }
        return true
      }
      while (top < h && rowEmpty(top)) top++
      let bottom = h - 1
      while (bottom >= 0 && rowEmpty(bottom)) bottom--
      const colEmpty = (x) => {
        for (let y = 0; y < h; y++) {
          if (raw[(y * w + x) * 4 + 3] !== 0) return false
        }
        return true
      }
      let left = 0
      while (left < w && colEmpty(left)) left++
      let right = w - 1
      while (right >= 0 && colEmpty(right)) right--
      const outW = Math.max(0, right - left + 1)
      const outH = Math.max(0, bottom - top + 1)
      const trimmed = outW > 0 && outH > 0
        ? await sharp(buf).extract({ left, top, width: outW, height: outH }).png().toBuffer()
        : buf
      const base64 = trimmed.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

      const dir = path.resolve(process.cwd(), 'exports')
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const safeName = `md2card-${Date.now()}.png`
      let targetPath = path.join(dir, safeName)

      fs.writeFileSync(targetPath, trimmed)

      const httpBase = process.env.FILE_BASE_URL
        ?? (process.env.MCP_HTTP_PORT ? `http://localhost:${process.env.MCP_HTTP_PORT}`
        : new urlLib.URL(baseUrl).origin)
      const publicUrl = `${httpBase}/files/${safeName}`

      return {
        content: [{ type: 'text', text: publicUrl }],
        structuredContent: { url: publicUrl }
      }
    } finally {
      await browser.close()
    }
  }
  )

  return server
}

const httpPort = parseInt(process.env.MCP_HTTP_PORT || '0', 10)
const server = createMcpServer()
if (httpPort) {
  const app = express()
  app.use(cors({ origin: true, credentials: true, methods: ['POST', 'OPTIONS'] }))
  app.use(express.json())
  app.use('/files', express.static(path.resolve(process.cwd(), 'exports')))

  const authToken = process.env.MCP_AUTH_TOKEN
  const requiredApiKey = process.env.MCP_API_KEY || 'woaihengheng'
  const auth = (req, res, next) => {
    const apiHeader = req.headers['x-api-key']
    const apiQuery = typeof req.query.apikey === 'string' ? req.query.apikey : undefined
    const apikeyOk = apiHeader === requiredApiKey || apiQuery === requiredApiKey
    if (!apikeyOk) return res.status(401).json({ error: 'invalid api key' })
    if (authToken) {
      const header = req.headers.authorization || ''
      const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined
      const ok = header === `Bearer ${authToken}` || queryToken === authToken
      if (!ok) return res.status(401).json({ error: 'unauthorized' })
    }
    next()
  }

  app.options('/mcp', cors({ origin: true, credentials: true }))

  app.post('/mcp', auth, async (req, res) => {
    const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true })
    const hostBase = `${req.protocol}://${req.headers.host}`
    process.env.FILE_BASE_URL = hostBase
    res.on('close', () => transport.close())
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  })

  app.listen(httpPort, () => {
    console.log(`MCP HTTP server on http://0.0.0.0:${httpPort}/mcp`)
  }).on('error', (err) => {
    console.error('HTTP server error:', err)
    process.exit(1)
  })
} else {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}