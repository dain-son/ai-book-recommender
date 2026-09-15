import React from 'react';
import { color, font } from '../theme';

/** app/page.tsx 의 분야 카드와 동일한 구조 */
export const GenreCard: React.FC<{
  emoji: string;
  name: string;
  description: string;
  selected?: boolean;
  style?: React.CSSProperties;
}> = ({ emoji, name, description, selected = false, style }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      borderRadius: 12,
      border: `1px solid ${selected ? color.accent : color.line}`,
      backgroundColor: selected ? color.accentSoft : color.surface,
      padding: 16,
      ...style,
    }}
  >
    <span style={{ fontSize: 24, lineHeight: 1 }}>{emoji}</span>
    <span style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          fontFamily: font.serif,
          fontSize: 16,
          fontWeight: 600,
          color: selected ? color.accent : color.foreground,
        }}
      >
        {name}
      </span>
      <span
        style={{
          display: 'block',
          marginTop: 4,
          fontSize: 12,
          lineHeight: 1.6,
          color: color.muted,
        }}
      >
        {description}
      </span>
    </span>
  </div>
);
