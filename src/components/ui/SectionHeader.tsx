import type { CSSProperties } from 'react';
import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  num?: string;
  eyebrow: string;
  title: React.ReactNode;
  /** Optional lead paragraph under the title. */
  lead?: string;
  /** Cap the title width for editorial ragged-right line breaks. */
  maxWidth?: number | string;
  align?: 'left' | 'center';
  visible?: boolean;
  style?: CSSProperties;
}

/**
 * Standard section opener: numbered eyebrow → oversized display title → lead.
 * Title uses PP Neue Montreal with tight negative tracking for editorial punch.
 */
export function SectionHeader({
  num,
  eyebrow,
  title,
  lead,
  maxWidth = 820,
  align = 'left',
  visible = true,
  style,
}: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <div
      className={`animate-on-scroll ${visible ? 'visible' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        gap: 'clamp(20px, 3vw, 32px)',
        ...style,
      }}
    >
      <Eyebrow num={num} line={centered}>{eyebrow}</Eyebrow>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-h2)',
          fontWeight: 500,
          letterSpacing: '-0.035em',
          lineHeight: 1.02,
          color: 'var(--ink)',
          maxWidth,
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          style={{
            fontSize: 'clamp(1rem, 1.2vw, 1.1875rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: 540,
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
