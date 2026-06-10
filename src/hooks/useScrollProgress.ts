import { useEffect, useRef } from 'react';

/**
 * Returns a normalized scroll progress value (0..1) for the entire page,
 * exposed via a ref so consumers can read it inside their own rAF
 * without forcing a React re-render on every scroll event.
 *
 * 0 = page top (window.scrollY === 0)
 * 1 = bottom of the document is at the bottom of the viewport
 *
 * Important: this hook deliberately does *not* publish a reactive state.
 * Pushing the value through React state means a re-render every scroll
 * tick (~60/s with Lenis), and the only consumer here — SceneStage —
 * already polls the ref inside its own animation loop. Adding state was
 * pure overhead.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current = Math.min(1, Math.max(0, p));
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return { progressRef };
}
