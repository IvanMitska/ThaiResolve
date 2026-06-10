import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/landing/Hero';
import { Problems } from './components/landing/Problems';
import { SceneStage } from './components/scene/SceneStage';
import type { ServiceType } from './types';

// Lazy load below-the-fold components
const Advantages = lazy(() => import('./components/landing/Advantages').then(m => ({ default: m.Advantages })));
const Steps = lazy(() => import('./components/landing/Steps').then(m => ({ default: m.Steps })));
const FAQ = lazy(() => import('./components/landing/FAQ').then(m => ({ default: m.FAQ })));
const ServiceForm = lazy(() => import('./components/form/ServiceForm').then(m => ({ default: m.ServiceForm })));

// Minimal loading placeholder
const SectionLoader = () => (
  <div style={{ minHeight: '400px' }} />
);

function App() {
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>(undefined);

  // Lenis smooth scroll — premium scroll feel across the whole site.
  // Lenis writes to window.scrollY, so the existing useScrollProgress
  // hook keeps working without any changes.
  useEffect(() => {
    const lenis = new Lenis({
      // Lighter smoothing than the default — perceptibly premium without
      // forcing every interaction to interpolate over a long duration,
      // which compounds with the scene's per-frame transform writes.
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
  };

  return (
    <>
      <SceneStage />
      <div className="film-grain" aria-hidden />
      <Layout>
        <Hero />
        <Problems onSelectService={handleSelectService} />
        <Suspense fallback={<SectionLoader />}>
          <Advantages />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Steps />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ServiceForm preselectedService={selectedService} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <FAQ />
        </Suspense>
      </Layout>
    </>
  );
}

export default App;
