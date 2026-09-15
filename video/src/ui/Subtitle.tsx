import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';

/**
 * 무음 영상이라 자막이 서사를 끌고 간다.
 * 화면 UI 위에 겹쳐 놓되, 아래쪽 안전 영역에 고정한다.
 */
export const Subtitle: React.FC<{
  lines: string[];
  /** 씬 시작 기준 등장 프레임 */
  from?: number;
  /** 씬 길이 (끝에서 페이드아웃) */
  until?: number;
}> = ({ lines, from = 6, until }) => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [from, from + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const disappear = until
    ? interpolate(frame, [until - 10, until], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const opacity = appear * disappear;
  const lift = interpolate(appear, [0, 1], [18, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 190,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(28, 25, 23, 0.88)',
          borderRadius: 22,
          padding: '26px 44px',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: font.sans,
              fontSize: 52,
              fontWeight: 500,
              lineHeight: 1.45,
              color: '#faf7f2',
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

/** 강조 색을 쓰는 자막 변형 (마지막 씬용) */
export const accentColor = color.accent;
