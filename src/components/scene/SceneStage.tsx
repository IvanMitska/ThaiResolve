import { memo, useEffect, useRef } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

/**
 * Site-wide parallax scene that lives behind the content.
 *
 * Layout uses absolutely-positioned HTML layers with viewport-relative
 * sizes (clamped) and viewport-relative motion (vw/vh). That keeps the
 * composition stable across different screen aspect ratios — fixed-pixel
 * sizes broke this on wider monitors.
 *
 * Composition (back → front):
 *   1. far bg    — large faint blobs, slow drift
 *   2. mid bg    — abstract shapes, moderate drift
 *   3. fg specks — small particles, fastest drift
 *
 * The hand/person 2D image models were removed — finished 3D models will
 * be dropped in here later. The parallax-driven background scaffold is
 * kept so those models have a stage to sit on.
 */
export const SceneStage = memo(function SceneStage() {
  const { progressRef } = useScrollProgress();

  const rootRef = useRef<HTMLDivElement>(null);
  const farBgRef = useRef<HTMLDivElement>(null);
  const midBgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    // Cache last values written to the DOM so we can skip redundant
    // style writes — those are the most expensive part of the rAF loop.
    let lastP = -1;
    let lastBgOpacity = -1;

    const tick = () => {
      const p = progressRef.current;
      const sy = window.scrollY;
      const vh = window.innerHeight;

      // Backgrounds: scroll-driven only (mouse parallax was removed —
      // it doubled the per-frame transform writes and was barely visible
      // since these layers already drift with scroll).
      if (p !== lastP) {
        const bgFadeStart = 0.4 * vh;
        const bgFadeEnd = 0.95 * vh;
        const bgOpacity = Math.max(
          0,
          Math.min(1, (bgFadeEnd - sy) / (bgFadeEnd - bgFadeStart))
        );
        const bgOpacityRounded = Math.round(bgOpacity * 100) / 100;
        const opacityChanged = bgOpacityRounded !== lastBgOpacity;
        lastBgOpacity = bgOpacityRounded;

        if (farBgRef.current) {
          if (opacityChanged) farBgRef.current.style.opacity = String(bgOpacityRounded);
          farBgRef.current.style.transform = `translate3d(0, ${-p * 60}px, 0)`;
        }
        if (midBgRef.current) {
          if (opacityChanged) midBgRef.current.style.opacity = String(bgOpacityRounded);
          midBgRef.current.style.transform = `translate3d(0, ${-p * 140}px, 0)`;
        }
        if (fgRef.current) {
          if (opacityChanged) fgRef.current.style.opacity = String(bgOpacityRounded);
          fgRef.current.style.transform = `translate3d(0, ${-p * 320}px, 0)`;
        }

        lastP = p;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* ─────────── 1. far background ─────────── */}
      <div
        ref={farBgRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-15vw',
            top: '8vh',
            width: '70vw',
            height: '70vw',
            borderRadius: '50%',
            background: 'var(--scene-far)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-20vw',
            top: '25vh',
            width: '65vw',
            height: '65vw',
            borderRadius: '50%',
            background: 'var(--scene-far)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '15vw',
            top: '70vh',
            width: '55vw',
            height: '55vw',
            borderRadius: '50%',
            background: 'var(--scene-far)',
          }}
        />
      </div>

      {/* ─────────── 2. mid background ─────────── */}
      <div
        ref={midBgRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        <div
          style={{
            position: 'absolute',
            right: '5vw',
            top: '5vh',
            width: '22vw',
            height: '22vw',
            borderRadius: '50%',
            background: 'var(--scene-mid)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '8vw',
            top: '40vh',
            width: '18vw',
            height: '18vw',
            borderRadius: '50%',
            background: 'var(--scene-mid)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '12vw',
            top: '78vh',
            width: '28vw',
            height: '28vw',
            borderRadius: '50%',
            background: 'var(--scene-mid)',
          }}
        />
      </div>

      {/* ─────────── 3. foreground specks ─────────── */}
      <div
        ref={fgRef}
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      >
        {[
          { left: '10vw', top: '15vh', size: 5 },
          { left: '88vw', top: '32vh', size: 4 },
          { left: '6vw', top: '55vh', size: 3 },
          { left: '94vw', top: '60vh', size: 5 },
          { left: '32vw', top: '88vh', size: 4 },
          { left: '72vw', top: '85vh', size: 3 },
          { left: '18vw', top: '12vh', size: 3 },
          { left: '82vw', top: '8vh', size: 4 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: 'var(--scene-near)',
            }}
          />
        ))}
      </div>
    </div>
  );
});
