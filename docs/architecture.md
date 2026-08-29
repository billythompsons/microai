# Architecture

MicroAI assumes no durable filesystem, always-on process, or local database in a Netlify deployment.

- Static site on Netlify CDN
- short-lived Netlify Functions for API and bounded jobs
- serverless PostgreSQL plus pgvector
- optional S3-compatible storage for originals
- server-side model adapters

Each source moves through pending, processing, ready, or failed states. Jobs carry a cursor and attempt count. One invocation claims a small batch, commits output and its cursor atomically, then schedules the next batch. Idempotency prevents duplicate chunks on retries.

At chat time the API resolves a public agent, checks origin and rate budget, embeds the query, retrieves tenant- and agent-scoped chunks, builds an evidence-only prompt, streams provider output, maps citations to stable sources, and stores the turn.
