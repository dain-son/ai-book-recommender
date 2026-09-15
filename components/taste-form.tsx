'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Answers, Genre } from '@/lib/db';
import { addToHistory } from '@/lib/history';

const LOADING_STEPS = [
  '취향을 정리하고 있어요',
  '요즘 화제인 책을 검색하고 있어요',
  '베스트셀러와 수상작을 훑어보고 있어요',
  '서평을 읽어보고 있어요',
  '네 권으로 추리고 있어요',
];

// 실측 1분 30초 안팎. 마지막 문구에서 오래 머무르도록 간격을 넉넉히 둔다.
const STEP_INTERVAL_MS = 20_000;

export function TasteForm({ genre }: { genre: Genre }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [freeText, setFreeText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const allAnswered = genre.questions.every((q) => (answers[q.id]?.length ?? 0) > 0);

  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [pending]);

  function toggle(questionId: string, option: string, multi: boolean) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (!multi) return { ...prev, [questionId]: [option] };
      return {
        ...prev,
        [questionId]: current.includes(option)
          ? current.filter((value) => value !== option)
          : [...current, option],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStep(0);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          genreSlug: genre.slug,
          answers,
          freeText: freeText.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? '추천에 실패했습니다.');
      addToHistory(data.sessionId);
      router.push(`/result/${data.sessionId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '추천에 실패했습니다.');
      setPending(false);
    }
  }

  if (pending) {
    return (
      <div className="mt-10 rounded-xl border border-line bg-surface p-8 text-center">
        <div
          aria-hidden
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent"
        />
        <p aria-live="polite" className="mt-5 font-serif text-base">
          {LOADING_STEPS[step]}
        </p>
        <p className="mt-2 text-xs text-muted">
          웹 검색을 거치기 때문에 1~2분쯤 걸립니다. 창을 닫지 말고 기다려 주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      {genre.questions.map((question) => {
        const picked = answers[question.id] ?? [];
        return (
          <fieldset key={question.id}>
            <legend className="font-serif text-base font-semibold">
              {question.label}
              <span className="ml-2 align-middle text-xs font-normal text-muted">
                {question.multi ? '여러 개 고를 수 있어요' : '하나만'}
              </span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.options.map((option) => {
                const selected = picked.includes(option);
                return (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
                      selected
                        ? 'border-accent bg-accent-soft text-accent font-medium'
                        : 'border-line bg-surface hover:border-accent'
                    }`}
                  >
                    <input
                      type={question.multi ? 'checkbox' : 'radio'}
                      name={question.id}
                      value={option}
                      checked={selected}
                      onChange={() => toggle(question.id, option, question.multi)}
                      className="sr-only"
                    />
                    {selected && <span aria-hidden>✓ </span>}
                    {option}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div>
        <label htmlFor="free-text" className="font-serif text-base font-semibold">
          덧붙이고 싶은 말이 있다면 <span className="text-sm font-normal text-muted">(선택)</span>
        </label>
        <textarea
          id="free-text"
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder="예) 최근에 읽고 좋았던 책, 피하고 싶은 주제, 읽는 목적 등"
          className="mt-3 w-full rounded-xl border border-line bg-surface p-3 text-sm outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-line bg-accent-soft p-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!allAnswered}
        className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        책 추천받기
      </button>
      {!allAnswered && (
        <p className="text-xs text-muted">모든 질문에 하나 이상 답하면 버튼이 활성화됩니다.</p>
      )}
    </form>
  );
}
