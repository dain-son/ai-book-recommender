import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';
import { questions, genres, PICKED_GENRE_INDEX } from '../data';
import { AppFrame } from '../ui/AppFrame';
import { Pill } from '../ui/Pill';
import { Subtitle } from '../ui/Subtitle';

const genre = genres[PICKED_GENRE_INDEX];

// 선택지가 순서대로 켜지는 시점 (질문 index, 선택지 index, 프레임)
const PICK_AT: { q: number; o: number; frame: number }[] = [
  { q: 0, o: 0, frame: 40 },
  { q: 0, o: 3, frame: 52 },
  { q: 1, o: 0, frame: 68 },
  { q: 2, o: 0, frame: 84 },
];

export const Questions: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPicked = (q: number, o: number) =>
    PICK_AT.some((p) => p.q === q && p.o === o && frame >= p.frame);

  return (
    <AbsoluteFill>
      <AppFrame>
        <div style={{ padding: '22px 20px 0' }}>
          <div
            style={{
              fontFamily: font.serif,
              fontSize: 26,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span>{genre.emoji}</span>
            <span>{genre.name}</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: color.muted }}>{genre.description}</div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {questions.map((question, qi) => {
              const enter = spring({
                frame: frame - 4 - qi * 8,
                fps,
                config: { damping: 200 },
                durationInFrames: 26,
              });

              return (
                <div
                  key={question.label}
                  style={{
                    opacity: enter,
                    transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {question.label}{' '}
                    <span style={{ fontSize: 12, color: color.muted, fontWeight: 400 }}>
                      {question.hint}
                    </span>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {question.options.map((option, oi) => (
                      <Pill key={option} label={option} selected={isPicked(qi, oi)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 24,
              display: 'inline-block',
              borderRadius: 12,
              backgroundColor: frame >= 92 ? color.accent : '#d6bfb2',
              color: '#ffffff',
              padding: '13px 22px',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            책 추천받기
          </div>
        </div>
      </AppFrame>

      <Subtitle lines={['취향을 몇 가지 여쭤봅니다']} from={14} until={durationInFrames} />
    </AbsoluteFill>
  );
};
