import React from 'react';
import { color } from '../theme';

/** 취향 질문 선택지 (components/taste-form.tsx 의 label 과 동일) */
export const Pill: React.FC<{
  label: string;
  selected?: boolean;
  style?: React.CSSProperties;
}> = ({ label, selected = false, style }) => (
  <span
    style={{
      display: 'inline-block',
      borderRadius: 9999,
      border: `1px solid ${selected ? color.accent : color.line}`,
      backgroundColor: selected ? color.accentSoft : color.surface,
      color: selected ? color.accent : color.foreground,
      padding: '8px 16px',
      fontSize: 13,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {label}
  </span>
);
