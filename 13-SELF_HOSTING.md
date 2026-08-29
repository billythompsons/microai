# Self-host MicroAI

## 1. Create accounts

Create a free Neon project and a free Groq project. In Neon, enable `pgcrypto` and `vector` by running the migrations in `packages/db/migrations/` in numeric order. Create a Groq API key for the shared public allowance.

## 2. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/billythompsons/microai)

Fork or clone the repository, connect it to Netlify, and use Node 20 or newer. Netlify reads `netlify.toml`, runs `npm run build`, publishes `dist`, and bundles the functions under `netlify/functions`.

## 3. Configure environment variables

Set these in Netlify for Builds, Functions, and Runtime. Mark all secret values as secrets.

- `DATABASE_URL`: Neon pooled connection string.
- `GROQ_API_KEY`: shared allowance key. Visitors do not need their own key.
- `GROQ_MODEL`: defaults to `openai/gpt-oss-20b`.
- `AUTH_SECRET`: at least 32 random bytes; signs anonymous/account sessions and encrypts optional BYOK.
- `RATE_LIMIT_SALT`: random bytes used to hash IPs for quotas.
- `INGEST_SECRET`: random bytes for the operator-only demo seed/ingestion endpoint.

Never put keys in `site/`, commit them, or expose them in client JavaScript.

## 4. Verify

Open the deploy, create an agent without signing up, paste a text source, ask a question in Playground, verify the response cites the source, then copy the Embed snippet. Optional email + recovery-code accounts keep agents across devices. Optional Groq BYOK removes dependence on the shared allowance for that agent; the key is encrypted in PostgreSQL and never returned to the client.

## Limits and security

The hosted defaults are 900 shared generations per day, 30 per visitor, and 120 per agent. Each agent accepts up to 20 sources; each paste/URL is capped at 60,000 extracted characters and 40 chunks. URL ingestion allows public HTTP(S), resolves DNS, blocks private/link-local addresses, rejects credentials and redirects, and limits response size. Tune constants in `netlify/functions/_shared.mts` and `sources.mts` for your own instance.
