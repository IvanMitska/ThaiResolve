import { memo, useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: string;
  duration?: number;
  delay?: number;
}

/**
 * Counts up to a target number when the element scrolls into view.
 *
 * Accepts strings like "100+", "24h", "95%" and animates only the numeric
 * portion so the surrounding suffix renders immediately on the final
 * frame. The element starts the count exactly once, the first time it
 * crosses the viewport — repeated entries do not re-trigger.
 */
export const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 1800,
  delay = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const playedRef = useRef(false);

  // Parse "100+" → "100"+suffix, or "<1ч" → prefix"<" + "1" + "ч"
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : '';
  const isInteger = match ? !match[2].includes('.') : true;
  const hasNumber = !!match;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true;
          observer.disconnect();

          const start = performance.now() + delay;
          let raf = 0;
          const tick = (now: number) => {
            const t = Math.max(0, Math.min(1, (now - start) / duration));
            // ease-out cubic for a satisfying decelerating count
            const eased = 1 - Math.pow(1 - t, 3);
            const current = target * eased;
            const formatted = isInteger
              ? Math.round(current).toString()
              : current.toFixed(1);
            setDisplay(prefix + formatted + suffix);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, suffix, isInteger, duration, delay]);

  // Initial state: zero with prefix/suffix so the layout is stable from the start
  useEffect(() => {
    if (!playedRef.current) {
      setDisplay(hasNumber ? prefix + '0' + suffix : value);
    }
  }, [prefix, suffix, hasNumber, value]);

  return <span ref={ref}>{display}</span>;
});
