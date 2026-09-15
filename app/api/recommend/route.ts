import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql, type Genre } from '@/lib/db';
import { recommendBooks } from '@/lib/recommend';

// 웹 검색 + 생성이 오래 걸릴 수 있다.
export const maxDuration = 300;

const bodySchema = z.object({
  genreSlug: z.string().min(1),
  answers: z.record(z.string(), z.array(z.string()).min(1)),
  freeText: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const rows = (await sql`
    select slug, name, emoji, description, questions
    from genres where slug = ${body.genreSlug}
  `) as Genre[];

  const genre = rows[0];
  if (!genre) {
    return NextResponse.json({ error: '존재하지 않는 분야입니다.' }, { status: 404 });
  }

  let result;
  try {
    result = await recommendBooks({
      genre,
      answers: body.answers,
      freeText: body.freeText,
    });
  } catch (error) {
    console.error('[recommend] AI 호출 실패', error);
    return NextResponse.json(
      { error: '추천을 만드는 중에 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 },
    );
  }

  if (result.books.length === 0) {
    return NextResponse.json(
      { error: '조건에 맞는 책을 찾지 못했습니다. 답변을 바꿔서 다시 시도해 주세요.' },
      { status: 502 },
    );
  }

  const [session] = (await sql`
    insert into sessions (genre_slug, answers, free_text)
    values (${genre.slug}, ${JSON.stringify(body.answers)}::jsonb, ${body.freeText ?? null})
    returning id
  `) as { id: string }[];

  for (const [index, book] of result.books.entries()) {
    await sql`
      insert into recommendations
        (session_id, position, title, author, published, one_liner, why_for_you, buzz, tags, topic, sources)
      values (
        ${session.id}, ${index}, ${book.title}, ${book.author}, ${book.published},
        ${book.oneLiner}, ${book.whyForYou}, ${book.buzz},
        ${book.tags ?? []}, ${book.topic ?? null}, ${JSON.stringify(result.sources)}::jsonb
      )
    `;
  }

  return NextResponse.json({ sessionId: session.id });
}
