import { memo, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
  /** Maximum displacement in pixels at the edge of the magnetic field. */
  strength?: number;
  /** Radius (px) inside which the cursor starts pulling the button. */
  radius?: number;
}

/**
 * A button that gently follows the cursor when the cursor enters its
 * magnetic field, then springs back to its rest position once the cursor
 * leaves. The inner span moves at a slightly larger amplitude than the
 * outer button to create a subtle "the label is being pulled along" feel.
 */
export const MagneticButton = memo(function MagneticButton({
  children,
  onClick,
  className,
  style,
  strength = 14,
  radius = 140,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let raf = 0;
    let running = false;
    let lastX = -999;
    let lastY = -999;

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.2;
      current.current.y += (target.current.y - current.current.y) * 0.2;
      const x = Math.round(current.current.x * 10) / 10;
      const y = Math.round(current.current.y * 10) / 10;

      if (x !== lastX || y !== lastY) {
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (innerRef.current) {
          innerRef.current.style.transform =
            `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
        }
        lastX = x;
        lastY = y;
      }

      const settled =
        Math.abs(target.current.x - current.current.x) < 0.05 &&
        Math.abs(target.current.y - current.current.y) < 0.05;
      if (settled && target.current.x === 0 && target.current.y === 0) {
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

    // Listening to mousemove only while the cursor is in the button's
    // proximity (entered → leave). Outside that window the listener is
    // detached entirely, so no per-pixel math runs while the cursor is
    // anywhere else on the page.
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const pull = 1 - dist / radius;
        target.current.x = (dx / radius) * strength * pull * 1.6;
        target.current.y = (dy / radius) * strength * pull * 1.6;
        ensureRunning();
      } else if (target.current.x !== 0 || target.current.y !== 0) {
        target.current.x = 0;
        target.current.y = 0;
        ensureRunning();
      }
    };

    // Use a wider proximity area so the magnetic effect engages a beat
    // before the cursor is technically over the button — that's what
    // sells the "pulled toward the cursor" feel.
    const onEnter = () => {
      window.addEventListener('mousemove', onMove, { passive: true });
    };
    const onLeave = () => {
      window.removeEventListener('mousemove', onMove);
      target.current.x = 0;
      target.current.y = 0;
      ensureRunning();
    };

    // Bigger trigger zone than the button itself.
    const wrapper = btn.parentElement;
    const triggerNode = wrapper ?? btn;
    triggerNode.addEventListener('mouseenter', onEnter);
    triggerNode.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      triggerNode.removeEventListener('mouseenter', onEnter);
      triggerNode.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
    };
  }, [strength, radius]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={className}
      style={{
        ...style,
        willChange: 'transform',
      }}
    >
      <span
        ref={innerRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          willChange: 'transform',
        }}
      >
        {children}
      </span>
    </button>
  );
});
