import { useEffect, useRef } from 'react';

/**
 * Tracks viewport-normalized cursor position and exposes it through a ref
 * so consumers (notably SceneStage) can read inside their own rAF without
 * triggering re-renders.
 *
 * x and y are in the range [-1, 1], where (0, 0) is the viewport center.
 * The values are eased toward the target each frame so abrupt cursor
 * jumps don't translate into jittery parallax.
 *
 * Perf: the easing rAF is auto-paused once the value has converged on
 * the target (delta < 0.0005) and is woken up by the next mousemove.
 * On a stationary cursor the hook costs nothing.
 */
export function useMouseParallax() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let running = false;

    const tick = () => {
      const m = mouseRef.current;
      const t = targetRef.current;
      m.x += (t.x - m.x) * 0.08;
      m.y += (t.y - m.y) * 0.08;
      const settled =
        Math.abs(t.x - m.x) < 0.0005 && Math.abs(t.y - m.y) < 0.0005;
      if (settled) {
        m.x = t.x;
        m.y = t.y;
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetRef.current.x = (e.clientX / w) * 2 - 1;
      targetRef.current.y = (e.clientY / h) * 2 - 1;
      ensureRunning();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return { mouseRef };
}
