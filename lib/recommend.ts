import { generateText, Output, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { Answers, Genre } from './db';

/** 모델은 환경변수로 바꿀 수 있게 둔다. */
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-5.5';

/** 한 번의 추천에서 보여줄 책 수. */
const TARGET_BOOKS = 4;

const bookSchema = z.object({
  title: z.string().describe('책의 한국어 제목. 번역서라면 국내 출간 제목을 쓴다.'),
  author: z.string().describe('저자명. 번역서는 "저자 (옮긴이)" 형태도 가능.'),
  published: z.string().describe('출간 시점. 예: "2024년 3월" 또는 "2021".'),
  oneLiner: z.string().describe('이 책이 어떤 책인지 한 문장으로. 40자 내외.'),
  whyForYou: z
    .string()
    .describe(
      '사용자가 고른 답변을 직접 언급하면서, 왜 이 사람에게 이 책인지 2~3문장으로 설명한다.',
    ),
  buzz: z
    .string()
    .describe(
      '지금 이 책이 화제인 이유나 위상. 수상, 베스트셀러 진입, 드라마화, 재조명 등 구체적 근거를 쓴다. 근거를 못 찾았으면 스테디셀러로서의 위상을 쓴다.',
    ),
  tags: z.array(z.string()).describe('책의 분위기나 키워드 2~4개. 각 10자 이내.'),
});

const resultSchema = z.object({ books: z.array(bookSchema) });

export type GeneratedBook = z.infer<typeof bookSchema> & { topic: string };

export type RecommendInput = {
  genre: Genre;
  answers: Answers;
  freeText?: string;
};

/**
 * 웹 검색을 쓰면 모델이 본문에 마크다운 각주(`([도메인](url))`)를 섞어 넣는다.
 * 화면에는 그대로 노출되므로 걷어낸다. 출처는 '참고한 자료'에 따로 보여준다.
 */
function stripCitations(text: string) {
  return text
    .replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();
}

/** 첫 질문은 분야 안의 세부 관심 주제다. 복수 선택이 가능하다. */
function pickTopics(genre: Genre, answers: Answers) {
  const first = genre.questions[0];
  const picked = first ? (answers[first.id] ?? []) : [];
  return picked.length > 0 ? picked : [genre.name];
}

/**
 * 주제별 책 배분. 4자리를 고른 주제들에 고르게 나눈다.
 * 주제 3개면 [2, 1, 1] 처럼 앞쪽부터 한 권씩 더 준다.
 */
function allocate(topicCount: number) {
  const total = Math.max(TARGET_BOOKS, topicCount);
  const base = Math.floor(total / topicCount);
  const remainder = total % topicCount;
  return Array.from({ length: topicCount }, (_, i) => base + (i < remainder ? 1 : 0));
}

function buildPrompt(
  { genre, answers, freeText }: RecommendInput,
  topic: string,
  count: number,
  otherTopics: string[],
) {
  const today = new Date().toISOString().slice(0, 10);

  // 첫 질문(주제 선택)은 이미 topic 으로 반영했으므로 나머지 답변만 취향으로 넘긴다.
  const answerLines = genre.questions
    .slice(1)
    .map((q) => {
      const picked = answers[q.id];
      return picked?.length ? `- ${q.label} → ${picked.join(', ')}` : null;
    })
    .filter(Boolean)
    .join('\n');

  return `오늘은 ${today}이다. 한국 독자에게 책을 추천해 달라.

## 주제 (이 요청의 전부)
「${topic}」

이 요청에서는 오직 「${topic}」 주제의 책만 고른다. 정확히 ${count}권이다.
${
  otherTopics.length > 0
    ? `이 독자는 ${otherTopics.map((t) => `「${t}」`).join(', ')} 주제도 골랐지만, 그쪽은 다른 요청에서 따로 처리한다.
따라서 여기서는 그 주제의 책을 넣지 마라. 중복이 된다.`
    : ''
}
「${topic}」에 해당하지 않는 책은 아무리 화제여도 넣지 마라. 특히 분야 이름(${genre.name})에 이끌려
인접 주제(예: 음악, 공연 등)로 새지 않도록 주의하라.

## 이 독자의 취향
분야: ${genre.name}
${answerLines}
${freeText ? `\n독자가 직접 남긴 말: ${freeText}` : ''}

## 해야 할 일
1. web_search 로 "${topic} 추천 도서", "${topic} 베스트셀러", "${topic} 책" 을 검색해
   ${today} 기준 한국에서 실제로 화제이거나 꾸준히 읽히는 「${topic}」 책을 확인하라.
   교보문고·예스24·알라딘 베스트셀러, 주요 수상작, 언론 서평을 참고하라.
2. 그 결과와 위 취향을 함께 고려해 「${topic}」 책 ${count}권을 고른다.
3. 가능하면 최근 1~2년 안에 화제가 된 책을 최소 1권 포함하라.
   「${topic}」에 최신 화제작이 없다면 화제성을 포기하고 검증된 책을 골라라.
   주제를 벗어나는 것보다 화제성을 포기하는 편이 낫다.

## 규칙
- 반드시 실재하는 책만 추천한다. 제목·저자·출간 시점을 지어내지 마라. 확실하지 않으면 그 책은 빼라.
- 국내에 번역·출간된 책을 우선한다.
- whyForYou 에는 독자가 고른 답변을 실제로 반영해서, 이 사람에게 왜 맞는지 구체적으로 써라.
  일반적인 책 소개를 반복하지 마라.
- 모든 문장은 한국어 존댓말로 쓴다.`;
}

async function recommendForTopic(
  input: RecommendInput,
  topic: string,
  count: number,
  otherTopics: string[],
) {
  const { output, sources } = await generateText({
    model: openai(MODEL),
    prompt: buildPrompt(input, topic, count, otherTopics),
    tools: {
      web_search: openai.tools.webSearch({
        searchContextSize: 'medium',
        userLocation: { type: 'approximate', country: 'KR' },
      }),
    },
    // 검색 → 정리 → 구조화 출력까지 여러 스텝이 필요하다.
    stopWhen: stepCountIs(5),
    output: Output.object({ schema: resultSchema }),
  });

  // 모델에 따라 각주를 끼워 넣는 필드가 다르다 (gpt-6 계열은 published 에도 붙인다).
  // 필드를 하나씩 세지 말고 문자열 필드는 전부 훑는다.
  const books: GeneratedBook[] = output.books.slice(0, count).map((book) => ({
    ...book,
    topic,
    title: stripCitations(book.title),
    author: stripCitations(book.author),
    published: stripCitations(book.published),
    oneLiner: stripCitations(book.oneLiner),
    whyForYou: stripCitations(book.whyForYou),
    buzz: stripCitations(book.buzz),
    tags: book.tags.map(stripCitations).filter(Boolean),
  }));

  return { books, sources };
}

export async function recommendBooks(input: RecommendInput) {
  const topics = pickTopics(input.genre, input.answers);
  const counts = allocate(topics.length);

  // 주제별로 따로 호출한다. 한 번에 4권을 맡기면 모델이 특정 주제로 쏠려
  // 고른 주제 하나가 통째로 빠지는 일이 반복됐다. 나눠 부르면 커버리지가 구조적으로 보장된다.
  const settled = await Promise.allSettled(
    topics.map((topic, index) =>
      recommendForTopic(
        input,
        topic,
        counts[index],
        topics.filter((other) => other !== topic),
      ),
    ),
  );

  const failed = settled.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`[recommend] 주제 ${failed.length}/${topics.length}개 실패`, failed[0]);
  }
  // 전부 실패했을 때만 에러로 올린다. 일부만 실패하면 나머지로 보여준다.
  if (failed.length === topics.length) {
    throw (failed[0] as PromiseRejectedResult).reason;
  }

  const fulfilled = settled.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));

  // 주제가 겹치면 같은 책이 두 번 나올 수 있다. 제목+저자로 걸러낸다.
  const seen = new Set<string>();
  const books: GeneratedBook[] = [];
  for (const result of fulfilled) {
    for (const book of result.books) {
      const key = `${book.title}|${book.author}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      books.push(book);
    }
  }

  const uniqueSources = Array.from(
    new Map(
      fulfilled
        .flatMap((r) => r.sources)
        .filter((s): s is typeof s & { url: string } => 'url' in s && typeof s.url === 'string')
        .map((s) => [
          s.url,
          { title: 'title' in s && s.title ? String(s.title) : s.url, url: s.url },
        ]),
    ).values(),
  ).slice(0, 8);

  return { books, sources: uniqueSources };
}
