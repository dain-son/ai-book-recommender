'use client';

/**
 * 로그인이 없으므로 "내 추천 기록"은 브라우저에만 남긴다.
 * 서버에는 익명 세션 UUID만 있고, 그 UUID를 누가 만들었는지는 이 기기의 localStorage만 안다.
 * 시크릿 모드나 저장소 차단 환경에서는 접근 자체가 예외를 던지므로 전부 감싼다.
 */
const KEY = 'chaekgalpi:sessions';
const LIMIT = 50;

export function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export function addToHistory(sessionId: string) {
  try {
    const next = [sessionId, ...readHistory().filter((id) => id !== sessionId)].slice(0, LIMIT);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 저장이 막힌 브라우저에서도 추천 자체는 계속 동작해야 한다.
  }
}

export function removeFromHistory(sessionId: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(readHistory().filter((id) => id !== sessionId)));
  } catch {
    // 무시
  }
}
