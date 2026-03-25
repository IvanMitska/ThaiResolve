import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  const { ref, isVisible } = useInView();

  return (
    <div ref={ref} className={`${isVisible ? 'stagger-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`animate-on-scroll ${className}`}>{children}</div>;
}
