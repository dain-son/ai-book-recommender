import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';
import { Subtitle } from '../ui/Subtitle';

// README 의 "주제별 병렬 호출" 을 보여준다.
const LANES = [
  { topic: '어떻게 살아야 하나', done: 26 },
  { topic: '기술은 우리를 어디로', done: 34 },
];

export const Searching: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: color.background }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 110px',
          paddingBottom: 230, // 아래 자막 자리를 비워 두고 위쪽에서 중앙을 잡는다
        }}
      >
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 54,
            fontWeight: 600,
            color: color.foreground,
            opacity: spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 }),
          }}
        >
          주제별로 웹 검색 중
        </div>

        <div style={{ marginTop: 64, width: '100%', display: 'flex', flexDirection: 'column', gap: 34 }}>
          {LANES.map((lane, i) => {
            const enter = spring({
              frame: frame - 8 - i * 7,
              fps,
              config: { damping: 200 },
              durationInFrames: 22,
            });
            const progress = interpolate(frame, [10 + i * 6, lane.done], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const done = frame >= lane.done;

            return (
              <div key={lane.topic} style={{ opacity: enter }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 40,
                    color: done ? color.accent : color.muted,
                  }}
                >
                  <span>{lane.topic}</span>
                  <span style={{ fontSize: 36 }}>{done ? '✓' : '···'}</span>
                </div>
                <div
                  style={{
                    marginTop: 18,
                    height: 10,
                    borderRadius: 9999,
                    backgroundColor: color.line,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progress * 100}%`,
                      height: '100%',
                      backgroundColor: color.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Subtitle lines={['AI가 주제별로 웹을 검색해서']} from={6} until={durationInFrames} />
    </AbsoluteFill>
  );
};
