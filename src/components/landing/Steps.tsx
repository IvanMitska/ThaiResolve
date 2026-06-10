import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';
import { steps } from '../../config/services';

export const Steps = memo(function Steps() {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  return (
    <section
      id="steps"
      ref={ref}
      style={{
        padding: '120px 0',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header - KAIF style */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: '80px' }}
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
            {t('steps.label')}
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              maxWidth: '600px',
            }}
          >
            {t('steps.title')}
          </h2>
        </div>

        {/* Steps grid - KAIF style */}
        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: '32px',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{
                padding: '32px 24px',
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                transitionDelay: `${index * 0.15}s`,
              }}
            >
              {/* Step number - large, light weight */}
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '56px',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '20px',
                }}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t(step.titleKey)}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {t(step.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
