import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';

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
      {/* Background image - GPU accelerated */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(15, 30, 30, 0.8) 0%, rgba(20, 40, 40, 0.6) 100%)',
          transform: 'translateZ(0)',
        }}
      />

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
        <div className="animate-fade-in-up">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.4)',
              }}
            />
            {t('hero.badge')}
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="animate-fade-in-up delay-1"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            maxWidth: '800px',
          }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up delay-2"
          style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToForm}
          className="animate-fade-in-up delay-3 btn-scale"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px 36px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1E3A3A',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {t('hero.cta')}
          <ArrowDown size={16} />
        </button>

        {/* Stats */}
        <div
          className="animate-fade-in delay-5 hero-stats"
          style={{
            marginTop: '80px',
            display: 'flex',
            gap: '48px',
            flexWrap: 'wrap',
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
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                paddingLeft: '24px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '42px',
                  fontWeight: 300,
                  color: '#FFFFFF',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
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
