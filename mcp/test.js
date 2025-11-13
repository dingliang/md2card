import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'
import fs from 'node:fs'
import path from 'node:path'

async function main() {
  const transport = new StdioClientTransport({ command: 'node', args: ['mcp/server.js'] })
  const client = new Client({ name: 'md2card-test', version: '0.1.0' }, { capabilities: {} })
  await client.connect(transport)

  const list = await client.request({ method: 'tools/list' }, ListToolsResultSchema)
  if (!list.tools.find(t => t.name === 'generate-png')) throw new Error('tool not found')

  const exportsDir = path.resolve(process.cwd(), 'exports')
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true })

  const res = await client.request({
    method: 'tools/call',
    params: {
      name: 'generate-png',
      arguments: {
        markdown: '# 测试\n这是一个示例',
        theme: '默认'
      }
    }
  }, CallToolResultSchema)

  console.log('Raw result:', JSON.stringify(res, null, 2))
  const url = (res.structuredContent && res.structuredContent.url)
    || (res.content && res.content[0] && res.content[0].type === 'text' && res.content[0].text)
    || ''
  if (!url) throw new Error('no url returned')
  const name = new URL(url).pathname.split('/').pop()
  const expected = path.join(exportsDir, name)
  if (!fs.existsSync(expected)) throw new Error('file not created')
  console.log('OK', expected)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })