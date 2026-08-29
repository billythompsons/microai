# AI Chatroom

AI Chatroom is an immediately usable, open-source, Netlify-native cited chat app. Open the deployed site, ask about the project, and receive a streamed answer grounded in MicroAI's public docs with source links. It is not affiliated with Chatbase.

> **Status:** The public app is live at your Netlify site URL. It opens directly into chat. Bounded ingestion, deterministic local embeddings, Neon pgvector retrieval, Groq streaming generation, citations, rate limits, and the reusable chat component are live. The full multi-tenant builder and file/URL parsers remain roadmap work.

## Netlify-first design

MicroAI uses static hosting plus short, retryable Functions. Serverless PostgreSQL with pgvector stores relational and vector data. An upload or crawl creates bounded jobs; each invocation processes a small batch, checkpoints a cursor, and queues the next batch. Chat performs agent-scoped retrieval and streams model output.

Long-running workers, a bundled database, local model hosting on Netlify, unbounded crawls, voice, continuous channel listeners, and arbitrary code actions are intentionally outside v1. A model may run behind any network-reachable OpenAI-compatible API, but not inside Netlify.

## Repository map

- `site/`: immediately usable chat app with lightweight project navigation
- `netlify/functions/`: serverless API handlers
- `packages/core/`: tenant and provider contracts
- `packages/db/migrations/`: PostgreSQL/pgvector schema
- `packages/widget/`: reusable cited chat client
- `docs/`: architecture and roadmap

## Deploy your own

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/billythompsons/microai)

See [SELF_HOSTING.md](SELF_HOSTING.md) for Neon, Groq, environment-variable, security, quota, and end-to-end verification steps.

## Quick start

```bash
cp .env.example .env
npm install
npm run check
npm run build
npm run dev
```

Apply `packages/db/migrations/0001_foundation.sql` to a fresh serverless PostgreSQL database. Phase 1 does not run migrations automatically.

## Roadmap

1. **Foundation - landed:** site, Netlify shape, workspace/agent schema, session primitive, provider abstraction, CI.
2. **Knowledge:** safe URL/file ingestion, chunking, embeddings, pgvector retrieval, citations, deletion and re-indexing.
3. **Chat:** builder, playground, streaming public endpoint, domain-restricted embed widget.
4. **Learning:** feedback, unanswered queries, usage summaries, CSV export, then one schema-defined HTTP action.

Read [the architecture](docs/architecture.md), [roadmap](docs/roadmap.md), [contributing guide](CONTRIBUTING.md), [Code of Conduct](CODE_OF_CONDUCT.md), and [security policy](SECURITY.md). Licensed under [Apache-2.0](LICENSE).

## Live app

The public app indexes MicroAI's own public docs into a 384-dimensional deterministic feature-hashing embedding. This choice keeps visitor questions out of a second embedding vendor, works within Netlify Function limits, and is free. It is suitable for the small public demo corpus, not claimed as a semantic embedding replacement for production customer knowledge bases. Groq (`openai/gpt-oss-20b` by default) generates answers only from retrieved passages.

- `POST /api/ingest`: authenticated job creation and four-chunk checkpointed batches
- `POST /api/retrieve`: vector retrieval for an allowed origin
- `POST /api/chat`: pgvector retrieval plus streamed cited Groq answer
- `POST /api/seed`: authenticated idempotent seeding of the public docs

The shared endpoint defaults to 900 requests/day globally, 30 per visitor hash/day, and 120 per agent/day. Anyone can create an agent, add pasted text or a public URL, chat, and copy an embed without an account or key. Optional accounts keep agents across devices. Optional Groq BYOK is encrypted server-side and gives an agent its own provider limits. Set all secrets only in Netlify.
