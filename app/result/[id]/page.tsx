import Link from 'next/link';
import { notFound } from 'next/navigation';
import { normalizeAnswers, sql, type Recommendation, type StoredAnswers } from '@/lib/db';
import { BookCard } from '@/components/book-card';

export const dynamic = 'force-dynamic';

type SessionRow = {
  id: string;
  genre_slug: string;
  genre_name: string;
  genre_emoji: string;
  answers: StoredAnswers;
  free_text: string | null;
};

export default async function ResultPage({ params }: PageProps<'/result/[id]'>) {
  const { id } = await params;

  const sessionRows = (await sql`
    select s.id, s.genre_slug, s.answers, s.free_text,
           g.name as genre_name, g.emoji as genre_emoji
    from sessions s join genres g on g.slug = s.genre_slug
    where s.id = ${id}
  `) as SessionRow[];

  const session = sessionRows[0];
  if (!session) notFound();

  const books = (await sql`
    select r.id, r.position, r.title, r.author, r.published,
           r.one_liner, r.why_for_you, r.buzz, r.tags, r.topic, r.sources,
           coalesce(sum(case when f.vote = 1 then 1 else 0 end), 0)::int as likes
    from recommendations r
    left join feedback f on f.recommendation_id = r.id
    where r.session_id = ${session.id}
    group by r.id
    order by r.position
  `) as Recommendation[];

  const sources = books[0]?.sources ?? [];
  // 과거 세션은 답변이 문자열 하나로 저장돼 있어 배열로 맞춘 뒤 펼친다.
  const picks = Object.values(normalizeAnswers(session.answers)).flat();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <Link href={`/genre/${session.genre_slug}`} className="text-xs text-muted hover:text-accent">
        ← 다시 답하기
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
        <span aria-hidden>{session.genre_emoji}</span> {session.genre_name}, 이 네 권은 어떠세요?
      </h1>

      {picks.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {picks.map((pick) => (
            <li
              key={pick}
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted"
            >
              {pick}
            </li>
          ))}
        </ul>
      )}

      {session.free_text && (
        <p className="mt-3 text-xs leading-relaxed text-muted">“{session.free_text}”</p>
      )}

      <div className="mt-8 space-y-4">
        {books.map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </div>

      {sources.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium tracking-wide text-muted">참고한 자료</h2>
          <ul className="mt-3 space-y-1.5">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {source.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href={`/genre/${session.genre_slug}`}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          같은 분야에서 다시 받기
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-line bg-surface px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          다른 분야 보기
        </Link>
        <Link
          href="/my"
          className="rounded-xl border border-line bg-surface px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          내가 추천받은 책
        </Link>
      </div>
    </div>
  );
}
