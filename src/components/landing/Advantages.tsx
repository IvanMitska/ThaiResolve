import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';
import { advantages } from '../../config/services';

export const Advantages = memo(function Advantages() {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  return (
    <section
      ref={ref}
      style={{
        padding: '120px 0',
        background: '#F7F8F7',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header - KAIF style */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: '64px' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#8A9A9A',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '1px',
                background: '#8A9A9A',
              }}
            />
            {t('advantages.label')}
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: '#1E3A3A',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              maxWidth: '700px',
            }}
          >
            {t('advantages.title')}
          </h2>
        </div>

        {/* Cards grid - KAIF style */}
        <div
          className="advantages-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`animate-on-scroll ${isVisible ? 'visible' : ''} advantage-card`}
                style={{
                  padding: '32px 24px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E8E8',
                  borderRadius: '12px',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                {/* Large number */}
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '48px',
                    fontWeight: 300,
                    color: '#1E3A3A',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                >
                  {advantage.icon}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1E3A3A',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t(advantage.titleKey)}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '14px',
                    color: '#5A6B6B',
                    lineHeight: 1.6,
                  }}
                >
                  {t(advantage.descriptionKey)}
                </p>
              </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1000px) {
          .advantages-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .advantages-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
