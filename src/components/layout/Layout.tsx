import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Nav />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
