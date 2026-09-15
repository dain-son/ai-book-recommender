import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';
import { books, genres, PICKED_GENRE_INDEX } from '../data';
import { AppFrame } from '../ui/AppFrame';
import { BookCard } from '../ui/BookCard';
import { Subtitle } from '../ui/Subtitle';

const genre = genres[PICKED_GENRE_INDEX];

export const Results: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 카드가 등장한 뒤 천천히 위로 스크롤한다 (UI 픽셀 단위).
  const scroll = interpolate(frame, [42, durationInFrames - 6], [0, -640], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });

  return (
    <AbsoluteFill>
      <AppFrame offsetY={scroll}>
        <div style={{ padding: '28px 20px 40px' }}>
          <div style={{ fontSize: 12, color: color.muted }}>← 다시 답하기</div>
          <div
            style={{
              marginTop: 10,
              fontFamily: font.serif,
              fontSize: 23,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {genre.emoji} {genre.name}, 이 네 권은 어떠세요?
          </div>

          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {books.map((book, i) => {
              const enter = spring({
                frame: frame - 6 - i * 9,
                fps,
                config: { damping: 200 },
                durationInFrames: 30,
              });

              return (
                <BookCard
                  key={book.title}
                  index={i}
                  title={book.title}
                  author={book.author}
                  published={book.published}
                  topic={book.topic}
                  oneLiner={book.oneLiner}
                  why={book.why}
                  tags={book.tags}
                  style={{
                    opacity: enter,
                    transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </AppFrame>

      <Subtitle
        lines={['지금 읽기 좋은 네 권을,', '고른 이유까지']}
        from={16}
        until={74} // 카드가 주인공인 씬이라 자막은 먼저 비켜 준다
      />
    </AbsoluteFill>
  );
};
