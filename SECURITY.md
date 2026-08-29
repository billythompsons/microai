# Security policy

MicroAI is pre-release software; fixes target the latest `main`. Do not open public issues for vulnerabilities. Use GitHub private vulnerability reporting with impact, reproduction steps, and any suggested fix.

Provider keys stay server-side. Public chat must use agent-scoped IDs, origin allowlists, rate limits, and tenant-scoped queries. Ingestion must block private-network targets and untrusted redirects. Custom actions stay disabled until permissions, egress controls, and audit logging are complete.
