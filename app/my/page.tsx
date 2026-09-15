'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { readHistory, removeFromHistory } from '@/lib/history';

type MyBook = { title: string; author: string; topic: string | null };
type MySession = {
  id: string;
  genreName: string;
  genreEmoji: string;
  genreSlug: string;
  picks: string[];
  freeText: string | null;
  createdAt: string;
  books: MyBook[];
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export default function MyPage() {
  const [sessions, setSessions] = useState<MySession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const ids = readHistory();
    if (ids.length === 0) {
      setSessions([]);
      return;
    }
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? '기록을 불러오지 못했습니다.');
      setSessions(data.sessions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '기록을 불러오지 못했습니다.');
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function forget(id: string) {
    removeFromHistory(id);
    setSessions((current) => current?.filter((s) => s.id !== id) ?? null);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="font-serif text-2xl font-semibold sm:text-3xl">내가 추천받은 책</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        로그인이 없는 서비스라, 이 목록은 <strong className="font-medium">이 브라우저에만</strong>{' '}
        저장됩니다. 다른 기기나 시크릿 창에서는 보이지 않고, 브라우저 데이터를 지우면 함께
        사라집니다.
      </p>

      {sessions === null && (
        <p className="mt-10 text-center text-sm text-muted">불러오는 중…</p>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-line bg-accent-soft p-3 text-sm text-accent">
          {error}
        </p>
      )}

      {sessions !== null && sessions.length === 0 && (
        <div className="mt-10 rounded-xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-muted">아직 추천받은 기록이 없습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            첫 추천받으러 가기
          </Link>
        </div>
      )}

      {sessions !== null && sessions.length > 0 && (
        <ol className="mt-8 space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-base font-semibold">
                  <span aria-hidden>{session.genreEmoji}</span> {session.genreName}
                </h2>
                <span className="text-xs text-muted">{formatDate(session.createdAt)}</span>
              </div>

              {session.picks.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {session.picks.map((pick) => (
                    <li
                      key={pick}
                      className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
                    >
                      {pick}
                    </li>
                  ))}
                </ul>
              )}

              <ul className="mt-4 space-y-1.5">
                {session.books.map((book) => (
                  <li key={`${book.title}-${book.author}`} className="text-sm leading-relaxed">
                    <span className="font-serif font-semibold">{book.title}</span>
                    <span className="text-muted"> · {book.author}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
                <Link
                  href={`/result/${session.id}`}
                  className="text-xs text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  추천 이유 다시 보기 →
                </Link>
                <Link
                  href={`/genre/${session.genreSlug}`}
                  className="text-xs text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  이 분야로 또 받기
                </Link>
                <button
                  type="button"
                  onClick={() => forget(session.id)}
                  className="ml-auto text-xs text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  목록에서 지우기
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
