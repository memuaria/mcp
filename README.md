# Memuaria MCP

[Memuaria](https://memuaria.ru) helps families turn spoken and written memories into a keepsake book. Memuaria MCP connects compatible AI assistants to Memuaria through the open [Model Context Protocol](https://modelcontextprotocol.io).

Мемуария помогает сохранить семейные воспоминания в книге. Memuaria MCP позволяет совместимым AI-ассистентам работать с Мемуарией через открытый протокол MCP.

> [!IMPORTANT]
> **Public preview.** The hosted endpoint is still under development and is not available yet. The installation instructions below are ready for launch, but connections to `https://memuaria.ru/mcp` will fail until the service is released.

## What it does

Memuaria MCP is the official connection between Memuaria and MCP-compatible assistants. Depending on the tools available to your account, an assistant can help you:

- find Memuaria product and help information;
- understand the current state of a memory or story draft;
- prepare edits for your review;
- continue a Memuaria workflow without manually copying private text between applications.

The hosted service is the source of truth. This repository is the public home for documentation, configuration examples, future compatibility helpers, and the issue tracker; it does not contain Memuaria's private application or production infrastructure.

## Server address

```text
https://memuaria.ru/mcp
```

Transport: **Streamable HTTP**. Legacy SSE is not supported.

Most users should connect directly to this address. There is no server process to install, no repository to clone, and no Memuaria password or token to paste into a configuration file.

## Install

### Claude on the web and Claude Desktop

Remote custom connectors are shared across Claude's supported surfaces.

1. Open **Customize → Connectors**.
2. Select **Add custom connector**.
3. Enter `Memuaria` as the name and `https://memuaria.ru/mcp` as the remote MCP server URL.
4. Select **Add**, then **Connect** and complete sign-in when prompted.

Team and Enterprise workspaces may require an owner to add the connector first. See [Anthropic's remote connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

### Claude Code

Install for your user account:

```bash
claude mcp add --scope user --transport http memuaria https://memuaria.ru/mcp
```

Then start Claude Code and run `/mcp` to inspect the connection and complete authentication. To verify or remove it from the terminal:

```bash
claude mcp get memuaria
claude mcp remove --scope user memuaria
```

See the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) for scopes and troubleshooting.

### Codex CLI, Codex IDE extension, and ChatGPT desktop app

Codex clients and the ChatGPT desktop app share the same local MCP configuration. Add the server once:

```bash
codex mcp add memuaria --url https://memuaria.ru/mcp
```

If sign-in is required:

```bash
codex mcp login memuaria
```

Verify the configuration with `codex mcp list`. You can also add the server through **Settings → MCP servers → Add server**, choose **Streamable HTTP**, and enter the URL above. Restart the desktop app or IDE extension after saving.

Manual configuration in `~/.codex/config.toml`:

```toml
[mcp_servers.memuaria]
url = "https://memuaria.ru/mcp"
```

See the [official OpenAI MCP documentation](https://developers.openai.com/codex/mcp).

### ChatGPT on the web

ChatGPT on the web uses remote MCP tools supplied through installed plugins rather than the local Codex configuration file. A Memuaria plugin will be documented here when it is available. Until then, adding the URL to Codex does not automatically make it available in ChatGPT web.

### VS Code

Run **MCP: Open User Configuration** and add:

```json
{
  "servers": {
    "memuaria": {
      "type": "http",
      "url": "https://memuaria.ru/mcp"
    }
  }
}
```

User configuration keeps the connection available across projects. See [VS Code's MCP server documentation](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

### Cursor

Open **Customize → MCPs**, or create `~/.cursor/mcp.json` for a global connection:

```json
{
  "mcpServers": {
    "memuaria": {
      "url": "https://memuaria.ru/mcp"
    }
  }
}
```

Complete OAuth sign-in when Cursor prompts you. See the [Cursor MCP documentation](https://cursor.com/docs/mcp).

### Other MCP clients

Use this remote-server configuration when your client accepts the common `mcpServers` format:

```json
{
  "mcpServers": {
    "memuaria": {
      "type": "http",
      "url": "https://memuaria.ru/mcp"
    }
  }
}
```

Field names differ between clients. Choose **HTTP** or **Streamable HTTP**, not SSE, and use the server address exactly as shown above.

Clients that support only local `stdio` servers will need a compatibility launcher. Memuaria does not currently publish one. Prefer a client with direct Streamable HTTP support and do not install similarly named third-party packages on Memuaria's behalf.

## Authentication and privacy

Public information may be available without signing in. Access to account or book data requires Memuaria authentication and is limited to the signed-in user's permissions.

- Sign in only through a browser page on `memuaria.ru`.
- Never paste your Memuaria password, browser cookies, session values, or access tokens into MCP configuration files, shell commands, issues, or logs.
- When you approve a tool call, the information needed for that call is sent through your MCP client and may be processed by your AI provider. Review that provider's privacy and data-control settings before using private memories.
- Review every proposed change before approving it. Tool availability and approval behavior depend on your MCP client and account.
- Disconnect Memuaria from your MCP client when you no longer use it.

Use of the service is governed by the [Memuaria privacy policy](https://memuaria.ru/privacy-policy) and [terms of service](https://memuaria.ru/terms-of-service).

## Security

Treat MCP servers as software that can receive context and request actions through your AI client. Review the server address and requested permissions before connecting.

To report a vulnerability, use [GitHub's private security advisory form](https://github.com/memuaria/mcp/security/advisories/new). Please do not include private memories, personal data, credentials, or security-sensitive details in a public issue.

## Troubleshooting

### The server does not connect

1. Confirm the URL is exactly `https://memuaria.ru/mcp`.
2. Confirm the transport is HTTP or Streamable HTTP, not SSE or `stdio`.
3. Update your MCP client to a current version.
4. Reconnect or restart the client after changing its configuration.
5. If the client reports that authentication is required, complete sign-in in the browser window it opens.

During the public-preview period, a `404` response is expected until the hosted endpoint launches.

### Tools are missing

Tools can vary by authentication state, account permissions, and the page or workflow in use. Reconnect after signing in, then ask the client to refresh the server's tool list.

### Still stuck?

[Open a GitHub issue](https://github.com/memuaria/mcp/issues/new) with your client name, client version, operating system, and the redacted error message. Never attach tokens, cookies, private story text, or personal information.

## For contributors

Issues and documentation improvements are welcome. Please keep examples free of real personal data and credentials.

To test the hosted connection from a local checkout:

```bash
npm ci
npm run smoke
```

The smoke test accepts an optional `MEMUARIA_MCP_BEARER_TOKEN` environment variable, does not print it, and treats a standards-compliant authentication challenge as a successful reachability check.

The hosted Memuaria MCP service is developed and operated separately from this public integration repository. Server-side implementation details, deployment configuration, secrets, and customer data do not belong here.

## Links

- [Memuaria](https://memuaria.ru)
- [Help center](https://memuaria.ru/help)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [MIT license](LICENSE)
- [Issue tracker](https://github.com/memuaria/mcp/issues)
