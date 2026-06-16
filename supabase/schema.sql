-- Leash Web MVP — Supabase 스키마 (spec §5)
-- SQL 에디터에서 실행하세요.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  created_at timestamptz default now()
);

create table if not exists block_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  profile_name text not null,
  blocked_apps text[] not null,
  barrier_type text not null,            -- easy, medium, hardcore
  duration_minutes integer not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  is_active boolean default true
);

create table if not exists unlock_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references block_sessions(id),
  user_id uuid references users(id),
  action text not null,                  -- resist, bench, penalty_math, ...
  succeeded boolean default false,
  fine_amount integer default 0,
  attempted_at timestamptz default now()
);

-- 감시자 승인 요청 (Realtime 대상)
create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references block_sessions(id),
  user_id uuid references users(id),
  token text unique not null,
  guardian_name text not null,
  status text default 'pending',         -- pending, approved, denied
  created_at timestamptz default now()
);

create table if not exists daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  total_walk_minutes integer default 0,
  total_resists integer default 0,
  total_breaks integer default 0,
  total_fines integer default 0,
  unique(user_id, date)
);

-- 데모용 RLS: 익명 키로 approval_requests 읽기/쓰기 허용
alter table approval_requests enable row level security;

create policy "demo anon read"   on approval_requests for select using (true);
create policy "demo anon insert" on approval_requests for insert with check (true);
create policy "demo anon update" on approval_requests for update using (true);

-- Realtime publication에 추가
alter publication supabase_realtime add table approval_requests;
