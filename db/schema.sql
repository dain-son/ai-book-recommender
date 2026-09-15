-- 책 추천 서비스 스키마 (로그인 없음: 세션은 익명 UUID로만 식별)

create table if not exists genres (
  slug        text primary key,
  name        text not null,
  emoji       text not null,
  description text not null,
  questions   jsonb not null,
  sort_order  int not null default 0
);

create table if not exists sessions (
  id         uuid primary key default gen_random_uuid(),
  genre_slug text not null references genres(slug),
  answers    jsonb not null,
  free_text  text,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  position    int not null,
  title       text not null,
  author      text not null,
  published   text,
  one_liner   text not null,
  why_for_you text not null,
  buzz        text,
  tags        text[] not null default '{}',
  sources     jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists feedback (
  id                bigserial primary key,
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  vote              smallint not null check (vote in (1, -1)),
  created_at        timestamptz not null default now()
);

create index if not exists idx_sessions_genre on sessions (genre_slug, created_at desc);
create index if not exists idx_recs_session on recommendations (session_id, position);
create index if not exists idx_recs_title on recommendations (lower(title));
create index if not exists idx_feedback_rec on feedback (recommendation_id);

-- 추천된 책이 어느 세부 주제에 해당하는지 (나중에 추가된 컬럼)
alter table recommendations add column if not exists topic text;
