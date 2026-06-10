import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';
import { SectionHeader } from '../ui/SectionHeader';
import { advantages } from '../../config/services';

export const Advantages = memo(function Advantages() {
  const { t } = useTranslation();
  const { ref, isVisible } = useInView();

  return (
    <section
      ref={ref}
      style={{ padding: 'clamp(90px, 14vh, 160px) 0', position: 'relative' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
        <SectionHeader
          num="02"
          eyebrow={t('advantages.label')}
          title={t('advantages.title')}
          lead={t('advantages.lead')}
          visible={isVisible}
          maxWidth={680}
          style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}
        />

        <div
          className="advantages-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(16px, 2vw, 24px)',
          }}
        >
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`advantage-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(16px, 2vw, 24px)',
                padding: 'clamp(28px, 3.4vw, 48px)',
                borderRadius: '22px',
                border: '1px solid var(--line)',
                background: 'rgba(251, 250, 246, 0.55)',
                backdropFilter: 'blur(14px) saturate(150%)',
                WebkitBackdropFilter: 'blur(14px) saturate(150%)',
                transitionDelay: `${index * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.9,
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {advantage.icon}
                </span>
                <span style={{ flex: 1, height: '1px', background: 'var(--line)', transform: 'translateY(-8px)' }} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.375rem, 2.4vw, 2rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  color: 'var(--ink)',
                }}
              >
                {t(advantage.titleKey)}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: 360,
                }}
              >
                {t(advantage.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .advantage-card { transition: transform 0.4s var(--ease-expo), border-color 0.3s var(--ease-snap), background 0.3s var(--ease-snap); }
        .advantage-card:hover { transform: translateY(-6px); border-color: var(--ink); background: rgba(251, 250, 246, 0.75); }
        @media (hover: none) { .advantage-card:hover { transform: none; } }
        @media (max-width: 760px) {
          .advantages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
});
