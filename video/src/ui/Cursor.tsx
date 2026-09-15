import React from 'react';

/** 분야를 고르는 동작을 보여주기 위한 포인터 */
export const Cursor: React.FC<{ x: number; y: number; pressed?: boolean; opacity?: number }> = ({
  x,
  y,
  pressed = false,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      transform: `scale(${pressed ? 0.82 : 1})`,
      transformOrigin: 'top left',
      pointerEvents: 'none',
    }}
  >
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3l14 8.5-6.2 1.3L9.6 19 5 3z"
        fill="#1c1917"
        stroke="#faf7f2"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
