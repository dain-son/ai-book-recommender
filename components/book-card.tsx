'use client';

import { useState } from 'react';
import type { Recommendation } from '@/lib/db';

export function BookCard({ book, index }: { book: Recommendation; index: number }) {
  const [score, setScore] = useState(book.likes);
  const [voted, setVoted] = useState<1 | -1 | null>(null);

  async function vote(value: 1 | -1) {
    if (voted) return;
    setVoted(value);
    setScore((current) => current + value);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ recommendationId: book.id, vote: value }),
      });
      const data = await response.json();
      if (response.ok) setScore(data.score);
    } catch {
      // 피드백 실패는 읽기 경험을 막지 않는다. 낙관적 값을 그대로 둔다.
    }
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span aria-hidden className="font-serif text-sm text-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg leading-snug font-semibold">{book.title}</h2>
          <p className="mt-1 text-xs text-muted">
            {book.author}
            {book.published && ` · ${book.published}`}
          </p>
          {book.topic && (
            <p className="mt-2 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
              {book.topic}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{book.one_liner}</p>

      <div className="mt-4 rounded-lg bg-accent-soft p-4">
        <h3 className="text-xs font-medium tracking-wide text-accent">이 책을 고른 이유</h3>
        <p className="mt-2 text-sm leading-relaxed">{book.why_for_you}</p>
      </div>

      {book.buzz && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          <span className="font-medium">요즘 이 책은</span> · {book.buzz}
        </p>
      )}

      {book.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => vote(1)}
          disabled={voted !== null}
          aria-label="이 추천이 마음에 들어요"
          className={`rounded-full border px-3 py-1.5 text-xs transition disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            voted === 1 ? 'border-accent bg-accent-soft text-accent' : 'border-line hover:border-accent'
          }`}
        >
          👍 좋아요
        </button>
        <button
          type="button"
          onClick={() => vote(-1)}
          disabled={voted !== null}
          aria-label="이 추천은 취향이 아니에요"
          className={`rounded-full border px-3 py-1.5 text-xs transition disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            voted === -1 ? 'border-accent bg-accent-soft text-accent' : 'border-line hover:border-accent'
          }`}
        >
          👎 글쎄요
        </button>
        <span aria-live="polite" className="ml-auto text-xs text-muted">
          {voted ? '반영했습니다' : score > 0 ? `👍 ${score}` : ''}
        </span>
      </div>

      <a
        href={`https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(`${book.title} ${book.author}`)}`}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-3 inline-block text-xs text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        교보문고에서 찾아보기 ↗
      </a>
    </article>
  );
}
