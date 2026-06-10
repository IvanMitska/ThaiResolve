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

  // Parse "100+" → number 100, suffix "+"
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const isInteger = match ? !match[1].includes('.') : true;

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
            setDisplay(formatted + suffix);
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

  // Initial state: zero with suffix so the layout is stable from the start
  useEffect(() => {
    if (!playedRef.current) {
      setDisplay('0' + suffix);
    }
  }, [suffix]);

  return <span ref={ref}>{display}</span>;
});
