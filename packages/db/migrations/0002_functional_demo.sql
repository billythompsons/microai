create table if not exists knowledge_chunks (
 id bigserial primary key,
 agent_public_id text not null,
 source_slug text not null,
 source_title text not null,
 source_url text not null,
 chunk_index integer not null,
 content text not null,
 embedding vector(384) not null,
 created_at timestamptz not null default now(),
 unique(agent_public_id,source_slug,chunk_index)
);
create index if not exists knowledge_chunks_agent_idx on knowledge_chunks(agent_public_id);
create index if not exists knowledge_chunks_embedding_idx on knowledge_chunks using hnsw (embedding vector_cosine_ops);
create table if not exists demo_usage (
 day date not null default current_date,
 client_hash text not null,
 requests integer not null default 0,
 updated_at timestamptz not null default now(),
 primary key(day,client_hash)
);
create table if not exists ingest_jobs (
 id uuid primary key default gen_random_uuid(),
 agent_public_id text not null,
 source_slug text not null,
 source_title text not null,
 source_url text not null,
 content text not null,
 cursor integer not null default 0,
 status text not null default 'pending' check(status in ('pending','processing','ready','failed')),
 error text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
