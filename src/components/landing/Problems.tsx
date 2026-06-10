import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, AlertTriangle, Briefcase } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { services } from '../../config/services';
import type { ServiceType } from '../../types';

interface ProblemsProps {
  onSelectService: (serviceType: ServiceType) => void;
}

const icons: Record<string, React.ElementType> = {
  fraud: AlertTriangle,
  business: Briefcase,
};

export const Problems = memo(function Problems({ onSelectService }: ProblemsProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  const handleClick = (serviceId: ServiceType) => {
    onSelectService(serviceId);
    const formElement = document.getElementById('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      ref={ref}
      style={{
        padding: '120px 0',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: '64px', textAlign: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--text-muted)',
              }}
            />
            {t('services.label')}
            <span
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--text-muted)',
              }}
            />
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            {t('services.title')}
          </h2>
        </div>

        {/* Services cards */}
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {services.map((service, index) => {
            const Icon = icons[service.id] || AlertTriangle;
            return (
              <button
                key={service.id}
                onClick={() => handleClick(service.id)}
                className={`animate-on-scroll ${isVisible ? 'visible' : ''} service-card`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '32px',
                  background: 'rgba(255,255,255,0.88)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                  }}
                >
                  <Icon size={28} color="#FFFFFF" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t(service.titleKey)}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                    flex: 1,
                  }}
                >
                  {t(service.subtitleKey)}
                </p>

                {/* Arrow link */}
                <div
                  className="service-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t('services.learnMore', 'Подробнее')}
                  <ArrowRight size={16} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
