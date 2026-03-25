import { useState, lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/landing/Hero';
import { Problems } from './components/landing/Problems';
import type { ServiceType } from './types';

// Lazy load below-the-fold components
const Advantages = lazy(() => import('./components/landing/Advantages').then(m => ({ default: m.Advantages })));
const Steps = lazy(() => import('./components/landing/Steps').then(m => ({ default: m.Steps })));
const FAQ = lazy(() => import('./components/landing/FAQ').then(m => ({ default: m.FAQ })));
const ServiceForm = lazy(() => import('./components/form/ServiceForm').then(m => ({ default: m.ServiceForm })));

// Minimal loading placeholder
const SectionLoader = () => (
  <div style={{ minHeight: '400px', background: '#F7F8F7' }} />
);

function App() {
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>(undefined);

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
  };

  return (
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
  );
}

export default App;
