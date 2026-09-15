import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';
import { Subtitle } from '../ui/Subtitle';

export const Hook: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brand = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const title = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200 },
    durationInFrames: 34,
  });

  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.background, opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 90px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 46,
            fontWeight: 600,
            color: color.accent,
            letterSpacing: '0.06em',
            opacity: brand,
            transform: `translateY(${interpolate(brand, [0, 1], [24, 0])}px)`,
          }}
        >
          책갈피
        </div>

        <div
          style={{
            marginTop: 44,
            fontFamily: font.serif,
            fontSize: 92,
            fontWeight: 600,
            lineHeight: 1.35,
            color: color.foreground,
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`,
          }}
        >
          오늘,
          <br />
          어떤 책을 읽을까요?
        </div>
      </AbsoluteFill>

      <Subtitle
        lines={['읽고 싶은 책은 많은데,', '뭘 읽을지는 모를 때']}
        from={38}
        until={durationInFrames}
      />
    </AbsoluteFill>
  );
};
