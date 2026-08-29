alter table public_agents add column if not exists provider text not null default 'groq';
alter table public_agents add column if not exists encrypted_api_key text;
update public_agents set encrypted_api_key=encrypted_groq_key where encrypted_api_key is null and encrypted_groq_key is not null;
create table if not exists public_agent_usage (
 day date not null default current_date,
 agent_public_id text not null,
 requests integer not null default 0,
 updated_at timestamptz not null default now(),
 primary key(day,agent_public_id)
);
create index if not exists public_agent_usage_day_idx on public_agent_usage(day);
alter table public_accounts add column if not exists password_salt text;
alter table public_accounts add column if not exists password_hash text;
create table if not exists public_chat_history (
 id bigserial primary key,
 owner_hash text not null,
 agent_public_id text not null references public_agents(public_id) on delete cascade,
 role text not null check(role in ('user','assistant')),
 content text not null,
 citations jsonb,
 created_at timestamptz not null default now()
);
create index if not exists public_chat_history_owner_agent_idx on public_chat_history(owner_hash,agent_public_id,created_at desc);
alter table public_sources drop constraint if exists public_sources_kind_check;
alter table public_sources add constraint public_sources_kind_check check(kind in ('text','url','file'));
