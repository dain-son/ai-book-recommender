// DB 초기화: 스키마 생성 + 분야/질문 시딩. `npm run db:init`
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import { GENRES } from '../db/genres.ts';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL 이 없습니다. `vercel env pull` 을 먼저 실행하세요.');
  process.exit(1);
}

const sql = neon(url);
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

// neon()의 태그드 템플릿은 다중 구문을 지원하지 않는다.
// 주석 줄을 먼저 걷어내지 않으면 주석이 뒤따르는 구문에 들러붙어 통째로 걸러진다.
const statements = schema
  .replace(/^\s*--.*$/gm, '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}
console.log(`스키마 적용 완료 (${statements.length}개 구문)`);

for (const g of GENRES) {
  await sql.query(
    `insert into genres (slug, name, emoji, description, questions, sort_order)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (slug) do update set
       name = excluded.name,
       emoji = excluded.emoji,
       description = excluded.description,
       questions = excluded.questions,
       sort_order = excluded.sort_order`,
    [g.slug, g.name, g.emoji, g.description, JSON.stringify(g.questions), g.sortOrder],
  );
}
console.log(`분야 ${GENRES.length}개 시딩 완료`);
