import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { SectionHeader } from '../ui/SectionHeader';
import { services } from '../../config/services';
import type { ServiceType } from '../../types';

interface ProblemsProps {
  onSelectService: (serviceType: ServiceType) => void;
}

export const Problems = memo(function Problems({ onSelectService }: ProblemsProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  const handleClick = (serviceId: ServiceType) => {
    onSelectService(serviceId);
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="services"
      ref={ref}
      style={{ padding: 'clamp(90px, 14vh, 160px) 0', position: 'relative' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
        <SectionHeader
          num="01"
          eyebrow={t('services.label')}
          title={t('services.title')}
          lead={t('services.lead')}
          visible={isVisible}
          maxWidth={760}
          style={{ marginBottom: 'clamp(48px, 7vh, 80px)' }}
        />

        {/* Two large editorial cards */}
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(20px, 2.4vw, 32px)',
          }}
        >
          {services.map((service, index) => {
            const tags = (t(`${service.titleKey.replace('.title', '')}.tags`, { returnObjects: true }) as string[]) || [];
            return (
              <button
                key={service.id}
                onClick={() => handleClick(service.id)}
                data-cursor
                className={`service-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(20px, 2.6vw, 32px)',
                  padding: 'clamp(28px, 3.4vw, 48px)',
                  background: 'var(--paper-card)',
                  border: '1px solid var(--line)',
                  borderRadius: '22px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                {/* Top: index + arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                      color: 'var(--accent)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {service.icon}
                  </span>
                  <span
                    className="card-arrow"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                    }}
                  >
                    <ArrowUpRight size={22} strokeWidth={1.5} />
                  </span>
                </div>

                {/* Title + description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.875rem, 3.4vw, 2.75rem)',
                      fontWeight: 500,
                      letterSpacing: '-0.035em',
                      lineHeight: 1,
                      color: 'var(--ink)',
                    }}
                  >
                    {t(service.titleKey)}
                  </h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 420 }}>
                    {t(service.subtitleKey)}
                  </p>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '999px',
                          border: '1px solid var(--line)',
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer CTA */}
                <div
                  className="card-cta"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingTop: 'clamp(20px, 2.4vw, 28px)',
                    borderTop: '1px solid var(--line)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                  }}
                >
                  {t('services.cardCta')}
                  <span className="card-cta-arrow" style={{ color: 'var(--accent)' }}>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .service-card { transition: transform 0.4s var(--ease-expo), border-color 0.3s var(--ease-snap); }
        .service-card .card-arrow { transition: background 0.3s var(--ease-snap), border-color 0.3s var(--ease-snap), color 0.3s var(--ease-snap), transform 0.4s var(--ease-expo); }
        .service-card .card-cta-arrow { transition: transform 0.3s var(--ease-expo); display: inline-block; }
        .service-card:hover { transform: translateY(-6px); border-color: var(--ink); }
        .service-card:hover .card-arrow { background: var(--accent); border-color: var(--accent); color: #fff; }
        .service-card:hover .card-cta-arrow { transform: translateX(6px); }
        @media (hover: none) { .service-card:hover { transform: none; } }
        @media (max-width: 760px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
});
