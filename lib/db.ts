import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL이 없습니다. `vercel env pull` 로 .env.local 을 받아오세요.');
}

export const sql = neon(process.env.DATABASE_URL);

export type Question = {
  id: string;
  label: string;
  options: string[];
  /** 여러 개 고를 수 있는 질문인지. 척도형 질문(경험 수준 등)은 false. */
  multi: boolean;
};

/** 질문 id → 고른 답변들. 과거 세션은 문자열 하나로 저장돼 있어 읽을 때 배열로 맞춘다. */
export type Answers = Record<string, string[]>;
export type StoredAnswers = Record<string, string | string[]>;

export function normalizeAnswers(stored: StoredAnswers): Answers {
  return Object.fromEntries(
    Object.entries(stored).map(([key, value]) => [key, Array.isArray(value) ? value : [value]]),
  );
}

export type Genre = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  questions: Question[];
};

export type Recommendation = {
  id: string;
  position: number;
  title: string;
  author: string;
  published: string | null;
  one_liner: string;
  why_for_you: string;
  buzz: string | null;
  tags: string[];
  topic: string | null;
  sources: { title: string; url: string }[];
  likes: number;
};
