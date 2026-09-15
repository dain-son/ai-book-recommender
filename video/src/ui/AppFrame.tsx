import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, UI_WIDTH, UI_SCALE, CANVAS } from '../theme';

const UI_HEIGHT = CANVAS.height / UI_SCALE; // 430 폭 기준 화면 높이

/**
 * 앱을 430px 폭(폰 크기)으로 그린 뒤 통째로 확대한다.
 * 덕분에 하위 컴포넌트는 앱과 똑같은 CSS 수치(p-5=20, rounded-xl=12)를 그대로 쓸 수 있다.
 */
export const AppFrame: React.FC<{
  children: React.ReactNode;
  /** 헤더/푸터 크롬 표시 여부 */
  chrome?: boolean;
  /** 내용 세로 오프셋 (스크롤 연출용, UI 픽셀 단위) */
  offsetY?: number;
}> = ({ children, chrome = true, offsetY = 0 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: color.background }}>
      <AbsoluteFill
        style={{
          width: UI_WIDTH,
          height: UI_HEIGHT,
          transform: `scale(${UI_SCALE})`,
          transformOrigin: 'top left',
          fontFamily: font.sans,
          color: color.foreground,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {chrome ? <Header /> : null}

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>{children}</div>
        </div>

        {chrome ? <Footer /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Header: React.FC = () => (
  <div
    style={{
      borderBottom: `1px solid ${color.line}`,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}
  >
    <span style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
      책갈피
    </span>
    <span style={{ display: 'flex', gap: 14, fontSize: 13, color: color.muted }}>
      <span>내 기록</span>
      <span>모아보기</span>
    </span>
  </div>
);

const Footer: React.FC = () => (
  <div
    style={{
      borderTop: `1px solid ${color.line}`,
      padding: '14px 20px',
      fontSize: 11,
      lineHeight: 1.6,
      color: color.muted,
      flexShrink: 0,
    }}
  >
    AI가 웹 검색 결과를 참고해 추천합니다. 출간 정보는 서점에서 한 번 더 확인해 주세요.
  </div>
);
