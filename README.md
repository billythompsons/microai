# AI Chatroom

AI Chatroom is a public, open-source builder for embeddable AI bots. Create a bot anonymously, add your own pasted text or public URLs, tune its instructions, tone, provider, and model, test it in the playground, then copy one HTML snippet into any site or app.

**Live app:** https://getaichatroom.netlify.app/

The bot uses your indexed content when relevant and cites the matching sources. When your content does not answer the question, it can answer as a general AI assistant and says that it is using general knowledge. The full flow works on the shared Groq allowance with no signup or API key. Optional accounts retain bots, sources, and chat history across devices. Optional Groq or OpenRouter BYOK gives each bot its own provider limits; keys are encrypted server-side.

## What is shipped

- Anonymous signed sessions and an optional email + password account
- One-time recovery code for password reset, rotated after use
- Anonymous-to-account upgrade that keeps existing bots and sources
- Multi-bot dashboard with instructions, tone, provider, and model controls
- Pasted-text and public-URL ingestion, chunking, local embeddings, and pgvector retrieval
- SSRF protection, response and source limits, manual redirect rejection, and private-network blocking
- Streaming chat with relevant-source citations and general-AI fallback
- Reusable `<microai-chat>` web component with portable, host-relative embed code
- Shared global, per-visitor, and per-bot quotas; optional encrypted Groq/OpenRouter BYOK
- Cross-device chat history for account owners

## Netlify-first design

AI Chatroom uses static hosting plus Netlify Functions. Neon PostgreSQL with pgvector stores bots, sources, vectors, accounts, quotas, and chat history. There is no always-on worker, bundled database, client-side provider secret, or local model process.

## Repository map

- `site/`: public builder, playground, and embed component
- `netlify/functions/`: session, account, bot, source, retrieval, and streaming chat handlers
- `packages/core/`: chunking, deterministic local embeddings, and provider contracts
- `packages/db/migrations/`: PostgreSQL/pgvector schema, including the public multi-tenant service
- `docs/`: architecture and future work

## Deploy your own

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/billythompsons/microai)

See [SELF_HOSTING.md](SELF_HOSTING.md) for Neon, Groq, environment variables, migrations, limits, and end-to-end checks.

```bash
cp .env.example .env
npm install
npm run check
npm run build
npm run dev
```

Apply every file in `packages/db/migrations/` in numeric order to a fresh Neon database before using the app.

## API surface

- `POST /api/session`: create or resume an anonymous signed session
- `GET/POST /api/agents`: list or create bots
- `GET/PATCH /api/agent`: open or update one owned bot
- `POST /api/sources`: ingest pasted text or a public URL
- `POST /api/chat`: retrieve relevant bot-scoped chunks and stream an answer
- `POST /api/auth`: create an account, log in, or reset with a recovery code

Hosted defaults are 900 shared generations/day globally, 30 per visitor/day, and 120 per bot/day. Each bot accepts 20 sources. Each paste or URL is capped at 60,000 extracted characters and 40 chunks.

Read [the architecture](docs/architecture.md), [future work](docs/roadmap.md), [contributing guide](CONTRIBUTING.md), [Code of Conduct](CODE_OF_CONDUCT.md), and [security policy](SECURITY.md). Licensed under [Apache-2.0](LICENSE).
