import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeAnswers, sql, type StoredAnswers } from '@/lib/db';

const bodySchema = z.object({
  ids: z.array(z.uuid()).max(50),
});

type SessionRow = {
  id: string;
  genre_slug: string;
  genre_name: string;
  genre_emoji: string;
  answers: StoredAnswers;
  free_text: string | null;
  created_at: string;
};

type BookRow = {
  session_id: string;
  title: string;
  author: string;
  topic: string | null;
};

export async function POST(request: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  if (body.ids.length === 0) return NextResponse.json({ sessions: [] });

  const sessions = (await sql`
    select s.id, s.genre_slug, s.answers, s.free_text, s.created_at,
           g.name as genre_name, g.emoji as genre_emoji
    from sessions s join genres g on g.slug = s.genre_slug
    where s.id = any(${body.ids}::uuid[])
    order by s.created_at desc
  `) as SessionRow[];

  const books = (await sql`
    select session_id, title, author, topic
    from recommendations
    where session_id = any(${body.ids}::uuid[])
    order by session_id, position
  `) as BookRow[];

  const bySession = new Map<string, BookRow[]>();
  for (const book of books) {
    const list = bySession.get(book.session_id);
    if (list) list.push(book);
    else bySession.set(book.session_id, [book]);
  }

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      genreName: s.genre_name,
      genreEmoji: s.genre_emoji,
      genreSlug: s.genre_slug,
      picks: Object.values(normalizeAnswers(s.answers)).flat(),
      freeText: s.free_text,
      createdAt: s.created_at,
      books: (bySession.get(s.id) ?? []).map((b) => ({
        title: b.title,
        author: b.author,
        topic: b.topic,
      })),
    })),
  });
}
