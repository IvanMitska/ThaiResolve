import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { AnimatedNumber } from './AnimatedNumber';

/** Splits a phrase into per-word spans that can be staggered into view. */
function StaggeredText({
  text,
  baseDelay = 0,
  perWordDelay = 80,
  className,
}: {
  text: string;
  baseDelay?: number;
  perWordDelay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            marginRight: '0.28em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: 'heroWordRise 0.95s cubic-bezier(0.22, 1, 0.36, 1) both',
              animationDelay: `${baseDelay + i * perWordDelay}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

export const Hero = memo(function Hero() {
  const { t } = useTranslation();

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Main content */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 24px 80px',
          width: '100%',
        }}
      >
        {/* Small label with line */}
        <div
          style={{
            opacity: 0,
            animation: 'heroFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards',
          }}
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
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--text-muted)',
              }}
            />
            {t('hero.badge')}
          </span>
        </div>

        {/* Main heading — staggered word-by-word reveal */}
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            maxWidth: '800px',
          }}
        >
          <StaggeredText text={t('hero.title')} baseDelay={350} perWordDelay={90} />
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            lineHeight: 1.7,
            marginBottom: '48px',
            opacity: 0,
            animation: 'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 900ms forwards',
          }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTA Button — magnetic, follows the cursor */}
        <div
          style={{
            opacity: 0,
            animation: 'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1100ms forwards',
            display: 'inline-block',
          }}
        >
          <MagneticButton
            onClick={scrollToForm}
            className="btn-scale"
            style={{
              padding: '18px 36px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              background: 'var(--text-primary)',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {t('hero.cta')}
            <ArrowDown size={16} />
          </MagneticButton>
        </div>

        {/* Stats — animated counters */}
        <div
          className="hero-stats"
          style={{
            marginTop: '80px',
            display: 'flex',
            gap: '48px',
            flexWrap: 'wrap',
            opacity: 0,
            animation: 'heroFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) 1400ms forwards',
          }}
        >
          {[
            { value: '100+', label: t('hero.stats.cases') },
            { value: '24h', label: t('hero.stats.response') },
            { value: '95%', label: t('hero.stats.success') },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                borderLeft: '1px solid var(--border)',
                paddingLeft: '24px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '42px',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedNumber value={stat.value} delay={1600 + index * 150} duration={1600} />
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
