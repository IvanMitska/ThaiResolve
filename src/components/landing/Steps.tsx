import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';
import { SectionHeader } from '../ui/SectionHeader';
import { steps } from '../../config/services';

export const Steps = memo(function Steps() {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  return (
    <section
      id="steps"
      ref={ref}
      style={{ padding: 'clamp(90px, 14vh, 160px) 0', position: 'relative' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
        <SectionHeader
          num="03"
          eyebrow={t('steps.label')}
          title={t('steps.title')}
          lead={t('steps.lead')}
          visible={isVisible}
          maxWidth={620}
          style={{ marginBottom: 'clamp(56px, 9vh, 96px)' }}
        />

        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: 'clamp(20px, 3vw, 40px)',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '24px',
                borderTop: '1px solid var(--ink)',
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9,
                  color: 'var(--ink)',
                  marginBottom: 'clamp(24px, 4vh, 44px)',
                }}
              >
                {step.number}
                <span style={{ color: 'var(--accent)' }}>.</span>
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  marginBottom: '12px',
                }}
              >
                {t(step.titleKey)}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
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

      <style>{`
        /* Frosted paper sheet behind each step so text stays legible over the
           3D hand. Cards over plain paper render the panel invisibly
           (paper-on-paper), so it only "appears" where the hand is behind. */
        .step-card { position: relative; isolation: isolate; }
        .step-card::before {
          content: '';
          position: absolute;
          inset: -2px clamp(-12px, -1.4vw, -20px) -14px;
          border-radius: 16px;
          background: rgba(242, 241, 236, 0.74);
          -webkit-backdrop-filter: blur(8px) saturate(1.05);
          backdrop-filter: blur(8px) saturate(1.05);
          z-index: -1;
          pointer-events: none;
        }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .step-card::before { background: rgba(242, 241, 236, 0.92); }
        }
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 40px !important; }
        }
        @media (max-width: 520px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          /* Single column sits directly over the hand — stronger veil + edge-to-edge */
          .step-card::before {
            inset: -2px -16px -16px;
            background: rgba(242, 241, 236, 0.86);
          }
        }
      `}</style>
    </section>
  );
});
