import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color } from '../theme';
import { genres, PICKED_GENRE_INDEX } from '../data';
import { AppFrame } from '../ui/AppFrame';
import { GenreCard } from '../ui/GenreCard';
import { Cursor } from '../ui/Cursor';
import { Subtitle } from '../ui/Subtitle';

const CLICK_FRAME = 96;

export const GenrePick: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const selected = frame >= CLICK_FRAME;

  // 커서: 화면 밖에서 시작해 철학·인문 카드로 이동한 뒤 클릭.
  const travel = interpolate(frame, [52, CLICK_FRAME], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  // 철학·인문(index 5)은 2열 그리드의 오른쪽 열 3번째 줄.
  // 커서 꼭짓점이 카드 안쪽에 오도록 캔버스 좌표를 직접 잡는다.
  const cursorX = interpolate(travel, [0, 1], [300, 760]);
  const cursorY = interpolate(travel, [0, 1], [1800, 950]);
  const pressed = frame >= CLICK_FRAME && frame < CLICK_FRAME + 8;

  return (
    <AbsoluteFill>
      <AppFrame>
        <div style={{ padding: '32px 20px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', color: color.muted }}>
            분야 고르기
          </div>

          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            {genres.map((genre, i) => {
              const enter = spring({
                frame: frame - 4 - i * 5,
                fps,
                config: { damping: 200 },
                durationInFrames: 28,
              });

              return (
                <GenreCard
                  key={genre.slug}
                  emoji={genre.emoji}
                  name={genre.name}
                  description={genre.description}
                  selected={selected && i === PICKED_GENRE_INDEX}
                  style={{
                    opacity: enter,
                    transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </AppFrame>

      <Cursor x={cursorX} y={cursorY} pressed={pressed} opacity={frame >= 46 ? 1 : 0} />

      <Subtitle lines={['분야를 하나 고르면']} from={20} until={durationInFrames} />
    </AbsoluteFill>
  );
};

