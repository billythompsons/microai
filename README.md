# MicroAI

MicroAI is an independent, open-source, Netlify-native foundation for building cited AI support agents from your own content. It is not affiliated with Chatbase.

> **Status:** Phase 1 foundation. The public site, Netlify project shape, workspace schema, session primitives, and provider abstraction are here. Ingestion and production chat are roadmap work, not released features.

## Netlify-first design

MicroAI uses static hosting plus short, retryable Functions. Serverless PostgreSQL with pgvector stores relational and vector data. An upload or crawl creates bounded jobs; each invocation processes a small batch, checkpoints a cursor, and queues the next batch. Chat performs agent-scoped retrieval and streams model output.

Long-running workers, a bundled database, local model hosting on Netlify, unbounded crawls, voice, continuous channel listeners, and arbitrary code actions are intentionally outside v1. A model may run behind any network-reachable OpenAI-compatible API, but not inside Netlify.

## Repository map

- `site/`: landing page and docs shell
- `netlify/functions/`: serverless API handlers
- `packages/core/`: tenant and provider contracts
- `packages/db/migrations/`: PostgreSQL/pgvector schema
- `packages/widget/`: future embed client
- `docs/`: architecture and roadmap

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
