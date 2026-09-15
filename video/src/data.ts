// 모두 실제 서비스에서 가져온 값. 렌더가 DB/네트워크에 의존하지 않도록 하드코딩한다.

// db/genres.ts 의 8개 분야 (sortOrder 순)
export const genres = [
  { slug: 'literature', name: '문학', emoji: '📖', description: '소설, 시, 희곡 — 이야기로 남는 것들' },
  { slug: 'science', name: '과학', emoji: '🔬', description: '물리, 생물, 우주, 뇌 — 세상의 작동 원리' },
  { slug: 'history', name: '역사', emoji: '🏛️', description: '지나간 일에서 지금을 읽기' },
  { slug: 'business', name: '경제·경영', emoji: '📈', description: '돈, 조직, 시장이 움직이는 방식' },
  { slug: 'self-development', name: '자기계발', emoji: '🌱', description: '습관, 태도, 일하는 법을 바꾸는 책' },
  { slug: 'philosophy', name: '철학·인문', emoji: '🧭', description: '질문을 더 좋은 질문으로 바꾸기' },
  { slug: 'essay', name: '에세이', emoji: '☕', description: '누군가의 하루와 문장을 곁에 두기' },
  { slug: 'art', name: '예술·문화', emoji: '🎨', description: '보는 법과 듣는 법을 배우기' },
] as const;

// 영상에서 선택되는 분야
export const PICKED_GENRE_INDEX = 5; // 철학·인문

// db/genres.ts 의 philosophy 질문
export const questions = [
  {
    label: '요즘 머릿속을 맴도는 질문은?',
    hint: '여러 개 고를 수 있어요',
    options: ['어떻게 살아야 하나', '나는 누구인가', '사회는 정의로운가', '기술은 우리를 어디로'],
    picks: [0, 3],
  },
  {
    label: '철학책 경험은?',
    hint: '하나만',
    options: ['거의 처음이에요', '입문서는 읽어봤어요', '원전도 읽을 수 있어요'],
    picks: [0],
  },
  {
    label: '선호하는 형식은?',
    hint: '여러 개 고를 수 있어요',
    options: ['해설이 친절한 입문서', '사상가 한 명 깊게', '현대 이슈와 엮은 책'],
    picks: [0],
  },
] as const;

// 씬 4에서 병렬로 검색되는 주제 (실제 recommendations.topic 값)
export const searchTopics = ['어떻게 살아야 하나', '기술은 우리를 어디로'] as const;

// 실제 추천 세션 4109aedf-… 의 결과.
// why 는 카드가 화면에 머무는 시간에 맞춰 첫 문장만 쓴다.
export const books = [
  {
    title: '소크라테스 익스프레스',
    author: '에릭 와이너 (김하현 옮김)',
    published: '2021년 4월',
    topic: '어떻게 살아야 하나',
    oneLiner: '철학자 14명의 생각으로 일상을 살아가는 법을 배웁니다.',
    why: '철학책은 ‘거의 처음’이고 ‘해설이 친절한 입문서’를 원하셔서, 추상적인 이론보다 일상의 질문에서 출발하는 이 책을 먼저 추천드립니다.',
    tags: ['일상철학', '삶의태도', '친근한해설'],
  },
  {
    title: '마흔에 읽는 쇼펜하우어',
    author: '강용수',
    published: '2023년 9월',
    topic: '어떻게 살아야 하나',
    oneLiner: '욕망과 관계를 돌아보며 덜 괴롭게 사는 법을 살펴봅니다.',
    why: '쇼펜하우어의 원전 대신, 연구자가 삶의 고민에 맞춰 30가지 조언으로 풀어낸 책을 추천드립니다.',
    tags: ['행복과욕망', '관계의거리', '자기기준'],
  },
  {
    title: '인간은 기계보다 특별할까?',
    author: '인문브릿지연구소',
    published: '2020년 2월',
    topic: '기술은 우리를 어디로',
    oneLiner: '기술이 바꿀 인간의 조건을 아홉 가지 질문으로 살펴보는 책입니다.',
    why: '각 장이 질문과 영화 사례로 시작해, 추상적인 개념만 따라가는 부담을 덜 수 있습니다.',
    tags: ['기술철학', '친절한입문', '기계와공존'],
  },
  {
    title: '넥서스',
    author: '유발 하라리 (김명주 옮김)',
    published: '2024년 10월',
    topic: '기술은 우리를 어디로',
    oneLiner: '정보 기술과 AI가 인간 사회의 질서를 어떻게 바꾸는지 묻는 책입니다.',
    why: 'AI의 작동법보다, 기술이 진실과 권력에 미치는 영향을 생각할 수 있는 책으로 골랐습니다.',
    tags: ['AI와사회', '정보와권력', '역사적해설'],
  },
] as const;

export const GITHUB_URL = 'github.com/dain-son/ai-book-recommender';
