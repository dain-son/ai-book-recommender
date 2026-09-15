import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const bodySchema = z.object({
  recommendationId: z.uuid(),
  vote: z.union([z.literal(1), z.literal(-1)]),
});

export async function POST(request: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  try {
    await sql`
      insert into feedback (recommendation_id, vote)
      values (${body.recommendationId}, ${body.vote})
    `;
  } catch {
    // 존재하지 않는 추천 id → 외래키 위반
    return NextResponse.json({ error: '존재하지 않는 추천입니다.' }, { status: 404 });
  }

  const [row] = (await sql`
    select coalesce(sum(vote), 0)::int as score
    from feedback where recommendation_id = ${body.recommendationId}
  `) as { score: number }[];

  return NextResponse.json({ score: row.score });
}
