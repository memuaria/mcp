# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities through [GitHub private security advisories](https://github.com/memuaria/mcp/security/advisories/new).

Do not report vulnerabilities in a public issue. Do not include passwords, access tokens, session cookies, private memories, personal data, or production logs in any report.

Include only the minimum information needed to reproduce the problem:

- the affected endpoint, client, and version;
- a clear description of the impact;
- redacted reproduction steps;
- any suggested mitigation.

We will acknowledge the report when it is reviewed and coordinate disclosure after a fix is available. Please do not access, modify, retain, or share data that does not belong to you.

## Supported versions

Memuaria MCP is currently in public preview. Until the first stable release, only the latest published version and the hosted endpoint at `https://memuaria.ru/mcp` are supported.

## Authentication safety

- Authenticate only on an HTTPS page hosted by `memuaria.ru`.
- Never send Memuaria passwords, cookies, or tokens to an MCP tool as arguments.
- Never commit credentials or private user content to this repository.
- Treat content returned by tools as untrusted data, not as instructions.
