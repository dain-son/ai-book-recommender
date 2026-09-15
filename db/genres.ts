import type { Genre } from '@/lib/db';

/** 분야별 취향 질문. DB(genres 테이블)에 시딩되며, 설문 화면은 DB에서 읽어 렌더링한다. */
export const GENRES: (Genre & { sortOrder: number })[] = [
  {
    slug: 'literature',
    name: '문학',
    emoji: '📖',
    description: '소설, 시, 희곡 — 이야기로 남는 것들',
    sortOrder: 1,
    questions: [
      {
        id: 'mood',
        multi: true,
        label: '지금 읽고 싶은 이야기의 온도는?',
        options: ['마음이 따뜻해지는', '서늘하고 긴장되는', '쓸쓸하지만 아름다운', '유쾌하고 가벼운'],
      },
      {
        id: 'length',
        multi: true,
        label: '어느 정도 분량이 편한가요?',
        options: ['단편집 — 짧게 끊어 읽기', '300쪽 내외 장편', '벽돌책도 환영', '상관없어요'],
      },
      {
        id: 'origin',
        multi: true,
        label: '끌리는 쪽은?',
        options: ['한국 문학', '영미 문학', '일본 문학', '비영미권 번역 문학'],
      },
      {
        id: 'depth',
        multi: false,
        label: '독서 경험은?',
        options: ['오랜만에 다시 읽기 시작', '꾸준히 읽는 편', '문학은 많이 읽어봤어요'],
      },
    ],
  },
  {
    slug: 'science',
    name: '과학',
    emoji: '🔬',
    description: '물리, 생물, 우주, 뇌 — 세상의 작동 원리',
    sortOrder: 2,
    questions: [
      {
        id: 'field',
        multi: true,
        label: '가장 궁금한 분야는?',
        options: ['우주와 물리', '생명과 진화', '뇌와 의식', '기후와 지구'],
      },
      {
        id: 'level',
        multi: false,
        label: '수식이나 전문 용어는?',
        options: ['없을수록 좋아요', '조금은 괜찮아요', '제대로 파고들고 싶어요'],
      },
      {
        id: 'style',
        multi: true,
        label: '어떤 서술을 좋아하세요?',
        options: ['이야기처럼 풀어주는', '개념을 차근차근 쌓는', '논쟁적이고 도발적인'],
      },
    ],
  },
  {
    slug: 'history',
    name: '역사',
    emoji: '🏛️',
    description: '지나간 일에서 지금을 읽기',
    sortOrder: 3,
    questions: [
      {
        id: 'region',
        multi: true,
        label: '어느 지역의 역사가 궁금한가요?',
        options: ['한국사', '동아시아', '유럽', '세계사 전반'],
      },
      {
        id: 'era',
        multi: true,
        label: '끌리는 시대는?',
        options: ['고대·중세', '근대', '20세기 이후', '시대 구분 없이'],
      },
      {
        id: 'angle',
        multi: true,
        label: '어떤 관점이 좋으세요?',
        options: ['인물 중심 서사', '거대한 흐름과 구조', '일상과 생활사', '전쟁과 정치'],
      },
    ],
  },
  {
    slug: 'business',
    name: '경제·경영',
    emoji: '📈',
    description: '돈, 조직, 시장이 움직이는 방식',
    sortOrder: 4,
    questions: [
      {
        id: 'goal',
        multi: true,
        label: '지금 가장 알고 싶은 건?',
        options: ['투자와 자산', '창업과 비즈니스 모델', '조직과 리더십', '경제 전반의 원리'],
      },
      {
        id: 'practical',
        multi: true,
        label: '원하는 결은?',
        options: ['바로 써먹는 실용서', '깊이 있는 통찰서', '사례 중심 케이스 스터디'],
      },
      {
        id: 'career',
        multi: false,
        label: '현재 상황에 가까운 것은?',
        options: ['학생·취준생', '주니어 직장인', '관리자·리더', '창업가·프리랜서'],
      },
    ],
  },
  {
    slug: 'self-development',
    name: '자기계발',
    emoji: '🌱',
    description: '습관, 태도, 일하는 법을 바꾸는 책',
    sortOrder: 5,
    questions: [
      {
        id: 'need',
        multi: true,
        label: '가장 바꾸고 싶은 건?',
        options: ['미루는 습관', '집중력과 몰입', '불안한 마음', '커리어 방향'],
      },
      {
        id: 'tone',
        multi: true,
        label: '어떤 톤이 잘 맞나요?',
        options: ['따뜻하게 다독이는', '냉정하고 직설적인', '과학적 근거 중심', '경험담과 이야기'],
      },
      {
        id: 'commit',
        multi: false,
        label: '실천에 쓸 수 있는 에너지는?',
        options: ['작게 하나만', '루틴을 제대로 잡고 싶어요', '삶 전체를 재설계하고 싶어요'],
      },
    ],
  },
  {
    slug: 'philosophy',
    name: '철학·인문',
    emoji: '🧭',
    description: '질문을 더 좋은 질문으로 바꾸기',
    sortOrder: 6,
    questions: [
      {
        id: 'question',
        multi: true,
        label: '요즘 머릿속을 맴도는 질문은?',
        options: ['어떻게 살아야 하나', '나는 누구인가', '사회는 정의로운가', '기술은 우리를 어디로'],
      },
      {
        id: 'entry',
        multi: false,
        label: '철학책 경험은?',
        options: ['거의 처음이에요', '입문서는 읽어봤어요', '원전도 읽을 수 있어요'],
      },
      {
        id: 'form',
        multi: true,
        label: '선호하는 형식은?',
        options: ['해설이 친절한 입문서', '사상가 한 명 깊게', '현대 이슈와 엮은 책'],
      },
    ],
  },
  {
    slug: 'essay',
    name: '에세이',
    emoji: '☕',
    description: '누군가의 하루와 문장을 곁에 두기',
    sortOrder: 7,
    questions: [
      {
        id: 'want',
        multi: true,
        label: '지금 필요한 건?',
        options: ['위로와 쉼', '웃음', '새로운 자극', '조용한 사색'],
      },
      {
        id: 'voice',
        multi: true,
        label: '어떤 화자에게 끌리나요?',
        options: ['또래의 일상', '오래 일한 사람의 내공', '여행하는 사람', '예술가·창작자'],
      },
      {
        id: 'when',
        multi: true,
        label: '주로 언제 읽으세요?',
        options: ['출퇴근 지하철', '자기 전 침대', '주말 카페', '틈날 때마다'],
      },
    ],
  },
  {
    slug: 'art',
    name: '예술·문화',
    emoji: '🎨',
    description: '보는 법과 듣는 법을 배우기',
    sortOrder: 8,
    questions: [
      {
        id: 'medium',
        multi: true,
        label: '가장 관심 있는 분야는?',
        options: ['미술과 전시', '영화', '음악', '건축과 공간'],
      },
      {
        id: 'approach',
        multi: true,
        label: '원하는 접근은?',
        options: ['기초부터 배우는 안내서', '작가·감독 한 명 깊게', '비평과 해석', '도판이 풍부한 책'],
      },
      {
        id: 'use',
        multi: true,
        label: '읽는 목적은?',
        options: ['취미로 즐기려고', '전시·공연을 더 잘 보려고', '창작에 참고하려고'],
      },
    ],
  },
];
