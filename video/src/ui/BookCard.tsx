import React from 'react';
import { color, font } from '../theme';

/** components/book-card.tsx 의 순서와 스타일을 그대로 따른다. */
export const BookCard: React.FC<{
  index: number;
  title: string;
  author: string;
  published: string;
  topic: string;
  oneLiner: string;
  why: string;
  tags: readonly string[];
  style?: React.CSSProperties;
}> = ({ index, title, author, published, topic, oneLiner, why, tags, style }) => (
  <div
    style={{
      borderRadius: 12,
      border: `1px solid ${color.line}`,
      backgroundColor: color.surface,
      padding: 20,
      ...style,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontFamily: font.serif, fontSize: 13, color: color.muted }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>
          {title}
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: color.muted }}>
          {author} · {published}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: 8,
            borderRadius: 9999,
            backgroundColor: color.accentSoft,
            color: color.accent,
            padding: '2px 10px',
            fontSize: 12,
          }}
        >
          {topic}
        </span>
      </div>
    </div>

    <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7 }}>{oneLiner}</div>

    <div
      style={{
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: color.accentSoft,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.02em', color: color.accent }}>
        이 책을 고른 이유
      </div>
      <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>{why}</div>
    </div>

    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            borderRadius: 9999,
            border: `1px solid ${color.line}`,
            padding: '4px 10px',
            fontSize: 12,
            color: color.muted,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);
