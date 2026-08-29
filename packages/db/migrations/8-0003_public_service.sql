create table if not exists public_agents (
 id uuid primary key default gen_random_uuid(),
 public_id text not null unique,
 owner_hash text not null,
 name text not null,
 instructions text not null default 'Answer clearly and only from the supplied evidence.',
 tone text not null default 'helpful',
 chat_model text not null default 'openai/gpt-oss-20b',
 encrypted_groq_key text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists public_agents_owner_idx on public_agents(owner_hash,updated_at desc);
create table if not exists public_sources (
 id uuid primary key default gen_random_uuid(),
 agent_public_id text not null references public_agents(public_id) on delete cascade,
 kind text not null check(kind in ('text','url')),
 title text not null,
 source_url text not null,
 content_chars integer not null default 0,
 created_at timestamptz not null default now()
);
create index if not exists public_sources_agent_idx on public_sources(agent_public_id,created_at desc);
alter table demo_usage add column if not exists agent_public_id text not null default 'microai-docs';
create index if not exists demo_usage_agent_idx on demo_usage(day,agent_public_id);
create table if not exists public_accounts (
 email text primary key,
 owner_hash text not null unique,
 recovery_hash text not null,
 created_at timestamptz not null default now()
);
