import Link from 'next/link';
import { sql, type Genre } from '@/lib/db';

export const dynamic = 'force-dynamic';

type LibraryBook = {
  title: string;
  author: string;
  published: string | null;
  one_liner: string;
  times: number;
  likes: number;
  genres: string[];
  last_at: string;
};

const SORTS = {
  popular: { label: '많이 추천된 순', order: 'times desc, likes desc, last_at desc' },
  liked: { label: '좋아요 많은 순', order: 'likes desc, times desc, last_at desc' },
  recent: { label: '최근 추천된 순', order: 'last_at desc' },
} as const;

type SortKey = keyof typeof SORTS;

export default async function BooksPage({ searchParams }: PageProps<'/books'>) {
  const params = await searchParams;
  const rawSort = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort: SortKey = rawSort === 'liked' || rawSort === 'recent' ? rawSort : 'popular';
  const rawGenre = Array.isArray(params.genre) ? params.genre[0] : params.genre;

  const genres = (await sql`
    select slug, name, emoji, description, questions from genres order by sort_order
  `) as Genre[];

  const activeGenre = genres.find((g) => g.slug === rawGenre)?.slug ?? null;

  // 같은 책이 여러 번 추천되므로 제목+저자로 묶는다.
  // 정렬 기준은 화이트리스트(SORTS)에서만 오므로 문자열로 이어 붙여도 안전하다.
  const books = (await sql.query(
    `select r.title,
            r.author,
            (array_agg(r.published order by r.created_at desc))[1] as published,
            (array_agg(r.one_liner order by r.created_at desc))[1] as one_liner,
            count(distinct r.id)::int as times,
            coalesce(sum(case when f.vote = 1 then 1 else 0 end), 0)::int as likes,
            array_agg(distinct g.name) as genres,
            max(r.created_at) as last_at
     from recommendations r
     join sessions s on s.id = r.session_id
     join genres g on g.slug = s.genre_slug
     left join feedback f on f.recommendation_id = r.id
     ${activeGenre ? 'where s.genre_slug = $1' : ''}
     group by r.title, r.author
     order by ${SORTS[sort].order}
     limit 60`,
    activeGenre ? [activeGenre] : [],
  )) as LibraryBook[];

  function href(next: { sort?: SortKey; genre?: string | null }) {
    const search = new URLSearchParams();
    const nextSort = next.sort ?? sort;
    const nextGenre = next.genre === undefined ? activeGenre : next.genre;
    if (nextSort !== 'popular') search.set('sort', nextSort);
    if (nextGenre) search.set('genre', nextGenre);
    const query = search.toString();
    return query ? `/books?${query}` : '/books';
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="font-serif text-2xl font-semibold sm:text-3xl">다른 분들이 추천받은 책</h1>
      <p className="mt-2 text-sm text-muted">
        지금까지 이 서비스가 추천한 책을 모았습니다. 같은 책이 여러 번 추천되면 한 줄로 묶입니다.
      </p>

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">분야</span>
          <Link
            href={href({ genre: null })}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              activeGenre === null
                ? 'border-accent bg-accent-soft text-accent font-medium'
                : 'border-line bg-surface hover:border-accent'
            }`}
          >
            전체
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={href({ genre: genre.slug })}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                activeGenre === genre.slug
                  ? 'border-accent bg-accent-soft text-accent font-medium'
                  : 'border-line bg-surface hover:border-accent'
              }`}
            >
              {genre.emoji} {genre.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">정렬</span>
          {(Object.keys(SORTS) as SortKey[]).map((key) => (
            <Link
              key={key}
              href={href({ sort: key })}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                sort === key
                  ? 'border-accent bg-accent-soft text-accent font-medium'
                  : 'border-line bg-surface hover:border-accent'
              }`}
            >
              {SORTS[key].label}
            </Link>
          ))}
        </div>
      </div>

      {books.length === 0 ? (
        <p className="mt-10 rounded-xl border border-line bg-surface p-8 text-center text-sm text-muted">
          아직 추천된 책이 없습니다.{' '}
          <Link href="/" className="text-accent hover:underline">
            첫 추천을 받아보세요
          </Link>
          .
        </p>
      ) : (
        <ol className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
          {books.map((book, index) => (
            <li key={`${book.title}-${book.author}`} className="flex gap-4 p-5">
              <span aria-hidden className="w-6 shrink-0 pt-0.5 font-serif text-sm text-muted">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-base leading-snug font-semibold">{book.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {book.author}
                  {book.published && ` · ${book.published}`}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{book.one_liner}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
                  <span className="rounded-full border border-line px-2 py-0.5">
                    {book.genres.join(', ')}
                  </span>
                  <span>{book.times}번 추천</span>
                  {book.likes > 0 && <span>👍 {book.likes}</span>}
                  <a
                    href={`https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(`${book.title} ${book.author}`)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    교보문고 ↗
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
