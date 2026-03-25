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
        background: '#F5F2ED',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Nav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
