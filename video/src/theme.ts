// app/globals.css 의 :root 값을 그대로 옮긴 것. 라이트 모드만 사용한다.
export const color = {
  background: '#faf7f2',
  surface: '#ffffff',
  foreground: '#1c1917',
  muted: '#6f6862',
  line: '#e7e0d6',
  accent: '#9a3412',
  accentSoft: '#fdf1e7',
} as const;

export const font = {
  sans: '"Noto Sans KR", "Malgun Gothic", system-ui, sans-serif',
  serif: '"Noto Serif KR", "Batang", serif',
} as const;

// 앱을 실제 CSS 픽셀 크기로 그린 뒤 한 번에 확대한다.
// 그래야 rounded-xl(12px), p-5(20px) 같은 실제 수치를 그대로 쓸 수 있다.
export const UI_WIDTH = 430;
export const CANVAS = { width: 1080, height: 1920 } as const;
export const UI_SCALE = CANVAS.width / UI_WIDTH; // 2.512...

export const VIDEO = { fps: 30, durationInFrames: 600 } as const;

// 씬 경계 (프레임). 합계가 durationInFrames 와 같아야 한다.
export const SCENE = {
  hook: 90,
  genrePick: 135,
  questions: 120,
  searching: 60,
  results: 135,
  outro: 60,
} as const;
