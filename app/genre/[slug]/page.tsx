import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sql, type Genre } from '@/lib/db';
import { TasteForm } from '@/components/taste-form';

export const dynamic = 'force-dynamic';

export default async function GenrePage({ params }: PageProps<'/genre/[slug]'>) {
  const { slug } = await params;

  const rows = (await sql`
    select slug, name, emoji, description, questions
    from genres where slug = ${slug}
  `) as Genre[];

  const genre = rows[0];
  if (!genre) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <Link href="/" className="text-xs text-muted hover:text-accent">
        ← 분야 다시 고르기
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
        <span aria-hidden>{genre.emoji}</span> {genre.name}
      </h1>
      <p className="mt-2 text-sm text-muted">{genre.description}</p>
      <TasteForm genre={genre} />
    </div>
  );
}
