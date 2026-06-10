import type { CSSProperties } from 'react';

interface EyebrowProps {
  /** Two-digit section index, e.g. "01". Rendered in accent before the label. */
  num?: string;
  children: React.ReactNode;
  /** Append a trailing hairline (used in centered headers). */
  line?: boolean;
  style?: CSSProperties;
  className?: string;
}

/**
 * Numbered micro-label — the editorial "(01) — Label" device that opens
 * every section. Accent dot, tabular index, uppercase tracked text.
 */
export function Eyebrow({ num, children, line, style, className }: EyebrowProps) {
  return (
    <span className={`eyebrow ${className ?? ''}`} style={style}>
      <span className="eyebrow__dot" />
      {num && <span className="eyebrow__num">{num}</span>}
      {num && <span style={{ opacity: 0.4 }}>—</span>}
      <span>{children}</span>
      {line && <span className="eyebrow__line" />}
    </span>
  );
}
