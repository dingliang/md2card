import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { createServer as createViteServer } from 'vite'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from '../mcp/server.js'

const PORT = parseInt(process.env.PORT || '5173', 10)
const MD2CARD_URL = process.env.MD2CARD_URL || `http://localhost:${PORT}/`
const AUTH = process.env.MCP_AUTH_TOKEN
const REQUIRED_API_KEY = process.env.MCP_API_KEY || 'woaihengheng'

const app = express()
app.use(cors({ origin: true, credentials: true, methods: ['POST', 'OPTIONS'] }))
app.use(express.json())
const exportsDir = path.resolve(process.cwd(), 'exports')
app.use('/files', express.static(exportsDir))

const mcpServer = createMcpServer()

const auth = (req, res, next) => {
  const apiHeader = req.headers['x-api-key']
  const apiQuery = typeof req.query.apikey === 'string' ? req.query.apikey : undefined
  const apikeyOk = apiHeader === REQUIRED_API_KEY || apiQuery === REQUIRED_API_KEY
  if (!apikeyOk) return res.status(401).json({ error: 'invalid api key' })
  if (!AUTH) return next()
  const header = req.headers.authorization || ''
  const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined
  const ok = header === `Bearer ${AUTH}` || queryToken === AUTH
  if (!ok) return res.status(401).json({ error: 'unauthorized' })
  next()
}

app.post('/mcp', auth, async (req, res) => {
  process.env.MD2CARD_URL = MD2CARD_URL
  const hostBase = `${req.protocol}://${req.headers.host}`
  process.env.FILE_BASE_URL = hostBase
  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true })
  res.on('close', () => transport.close())
  await mcpServer.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

// Attach Vite dev middleware
const vite = await createViteServer({ server: { middlewareMode: true } })
app.use(vite.middlewares)

app.listen(PORT, () => {
  console.log(`Unified dev server on http://localhost:${PORT}/ (MCP at /mcp)`) 
}).on('error', err => {
  console.error('Unified server error:', err)
  process.exit(1)
})