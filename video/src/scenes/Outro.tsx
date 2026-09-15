import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';
import { GITHUB_URL } from '../data';

export const Outro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brand = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });
  const line = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 28 });
  const url = spring({ frame: frame - 20, fps, config: { damping: 200 }, durationInFrames: 28 });

  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.background, opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 90px',
        }}
      >
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 108,
            fontWeight: 600,
            color: color.accent,
            letterSpacing: '0.04em',
            opacity: brand,
            transform: `translateY(${interpolate(brand, [0, 1], [22, 0])}px)`,
          }}
        >
          책갈피
        </div>

        <div
          style={{
            marginTop: 34,
            fontFamily: font.sans,
            fontSize: 44,
            lineHeight: 1.6,
            color: color.muted,
            opacity: line,
          }}
        >
          로그인 없이, 오늘 읽을 책 네 권
        </div>

        <div
          style={{
            marginTop: 72,
            fontFamily: font.sans,
            fontSize: 32,
            color: color.foreground,
            backgroundColor: color.surface,
            border: `1px solid ${color.line}`,
            borderRadius: 9999,
            padding: '18px 38px',
            opacity: url,
          }}
        >
          {GITHUB_URL}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
