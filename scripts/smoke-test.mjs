#!/usr/bin/env node

const endpoint = process.env.MEMUARIA_MCP_URL ?? 'https://memuaria.ru/mcp'
const bearerToken = process.env.MEMUARIA_MCP_BEARER_TOKEN
const protocolVersion = '2025-06-18'

function parseResponse(contentType, body) {
  if (contentType.includes('application/json')) return JSON.parse(body)
  if (contentType.includes('text/event-stream')) {
    const data = body
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .find((line) => line && line !== '[DONE]')
    if (data) return JSON.parse(data)
  }
  throw new Error(`unexpected response type: ${contentType || 'missing Content-Type'}`)
}

async function post(message, sessionId) {
  const headers = {
    Accept: 'application/json, text/event-stream',
    'Content-Type': 'application/json',
    'MCP-Protocol-Version': protocolVersion,
    'User-Agent': 'memuaria-mcp-smoke/0.1.0',
  }
  if (sessionId) headers['Mcp-Session-Id'] = sessionId
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  })
}

const initialize = await post({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion,
    capabilities: {},
    clientInfo: { name: 'memuaria-mcp-smoke', version: '0.1.0' },
  },
})

if (initialize.status === 401) {
  if (!initialize.headers.has('www-authenticate')) {
    throw new Error('server returned 401 without a WWW-Authenticate challenge')
  }
  console.log('Memuaria MCP is reachable and requires authentication.')
  process.exit(0)
}

if (!initialize.ok) {
  throw new Error(`initialize failed with HTTP ${initialize.status}`)
}

const initializedBody = await initialize.text()
const initialized = parseResponse(
  initialize.headers.get('content-type') ?? '',
  initializedBody,
)
if (initialized?.jsonrpc !== '2.0' || initialized?.id !== 1 || !initialized?.result?.serverInfo) {
  throw new Error('initialize returned an invalid MCP response')
}

const sessionId = initialize.headers.get('mcp-session-id')
const initializedNotification = await post(
  { jsonrpc: '2.0', method: 'notifications/initialized' },
  sessionId,
)
if (!initializedNotification.ok) {
  throw new Error(`notifications/initialized failed with HTTP ${initializedNotification.status}`)
}

const toolsResponse = await post({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, sessionId)
if (!toolsResponse.ok) throw new Error(`tools/list failed with HTTP ${toolsResponse.status}`)

const tools = parseResponse(
  toolsResponse.headers.get('content-type') ?? '',
  await toolsResponse.text(),
)
if (tools?.jsonrpc !== '2.0' || tools?.id !== 2 || !Array.isArray(tools?.result?.tools)) {
  throw new Error('tools/list returned an invalid MCP response')
}

console.log(`Memuaria MCP is healthy: ${tools.result.tools.length} tool(s) discovered.`)
