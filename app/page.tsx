import Link from 'next/link';
import { sql, type Genre } from '@/lib/db';

export const dynamic = 'force-dynamic';

type PopularBook = { title: string; author: string; times: number; likes: number };

export default async function HomePage() {
  const genres = (await sql`
    select slug, name, emoji, description, questions
    from genres order by sort_order
  `) as Genre[];

  const popular = (await sql`
    select r.title,
           r.author,
           count(distinct r.id)::int as times,
           coalesce(sum(case when f.vote = 1 then 1 else 0 end), 0)::int as likes
    from recommendations r
    left join feedback f on f.recommendation_id = r.id
    group by r.title, r.author
    order by times desc, likes desc
    limit 5
  `) as PopularBook[];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <h1 className="font-serif text-3xl leading-snug font-semibold sm:text-4xl">
        오늘, 어떤 책을 읽을까요?
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        분야를 하나 고르면 취향을 몇 가지 여쭤봅니다. 그 답을 바탕으로 요즘 화제인 책과 오래
        사랑받은 책 중에서 네 권을 골라 드립니다.
      </p>

      <h2 className="mt-12 text-sm font-medium tracking-wide text-muted">분야 고르기</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {genres.map((genre) => (
          <li key={genre.slug}>
            <Link
              href={`/genre/${genre.slug}`}
              className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span aria-hidden className="text-2xl leading-none">
                {genre.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-base font-semibold">{genre.name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {genre.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {popular.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium tracking-wide text-muted">
              다른 분들에게 많이 추천된 책
            </h2>
            <Link
              href="/books"
              className="shrink-0 text-xs text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              전체 보기 →
            </Link>
          </div>
          <ol className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
            {popular.map((book, index) => (
              <li key={`${book.title}-${book.author}`} className="flex items-baseline gap-3 p-4">
                <span aria-hidden className="w-4 shrink-0 text-sm text-muted">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-sm font-semibold">{book.title}</span>
                  <span className="block text-xs text-muted">{book.author}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {book.times}회 추천
                  {book.likes > 0 && ` · 👍 ${book.likes}`}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
