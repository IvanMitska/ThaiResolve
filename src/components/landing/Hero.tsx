import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

export const Hero = memo(function Hero() {
  const { t, i18n } = useTranslation();

  const scrollToForm = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Language-aware headline size — English stays huge; the longer Russian
  // phrase steps down so it still fills the screen without overflowing.
  const lang = (i18n.language || 'en').slice(0, 2);
  // The clamp min is the size on phones; raising it makes mobile bigger
  // without affecting desktop (where the vw / max terms win).
  const megaSize =
    lang === 'ru'
      ? 'clamp(3.75rem, 12.5vw, 13.5rem)'
      : lang === 'th'
      ? 'clamp(3.75rem, 12.5vw, 13.5rem)'
      : 'clamp(5.25rem, 16vw, 18rem)'; // EN — large enough to wrap to 3 lines

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <div
        className="hero-inner"
        style={{
          position: 'relative',
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: 'clamp(100px, 14vh, 150px) var(--pad-x) clamp(44px, 7vh, 80px)',
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {/* Display headline — mega phrase */}
        <h1 className="hero-title" style={{ margin: 0 }}>
          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontSize: megaSize,
                fontWeight: 700,
                letterSpacing: '-0.045em',
                lineHeight: 0.88,
                color: 'var(--ink)',
                animation: 'heroWordRise 1.1s cubic-bezier(0.16, 1, 0.3, 1) 520ms both',
              }}
            >
              {t('hero.mega')}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </span>
        </h1>

        {/* CTA — anchored to the bottom-right on desktop (title stays centered) */}
        <div
          className="hero-cta"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 'clamp(44px, 7vh, 80px)',
            opacity: 0,
            animation: 'heroFadeUp 0.9s var(--ease-expo) 1200ms forwards',
          }}
        >
          <MagneticButton
            onClick={scrollToForm}
            className="btn-pill btn-scale"
            style={{
              padding: '20px 34px',
              color: '#fff',
              background: 'var(--ink)',
              border: 'none',
            }}
          >
            {t('hero.cta')}
            <ArrowDown size={16} />
          </MagneticButton>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="hero-scroll-cue"
        style={{
          position: 'absolute',
          right: 'var(--pad-x)',
          bottom: 'clamp(24px, 4vh, 44px)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          opacity: 0,
          animation: 'heroFadeUp 1s var(--ease-expo) 1600ms forwards',
        }}
      >
        <span
          style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {t('hero.scroll')}
        </span>
        <span style={{ width: '48px', height: '1px', background: 'var(--text-muted)', position: 'relative', overflow: 'hidden' }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--accent)',
              animation: 'scrollCue 2.2s var(--ease-expo) infinite',
            }}
          />
        </span>
      </div>

      <style>{`
        @keyframes scrollCue {
          0% { transform: translateX(-100%); }
          60%, 100% { transform: translateX(100%); }
        }
        /* Mobile: center the big headline so it reads balanced. */
        @media (max-width: 768px) {
          .hero-inner {
            flex: 1;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding-top: 84px !important;
            padding-bottom: 56px !important;
          }
          .hero-title { text-align: center; }
          .hero-cta {
            position: static !important;
            margin-top: clamp(28px, 5vh, 44px) !important;
            align-self: center !important;
          }
        }
        @media (max-width: 640px) {
          .hero-scroll-cue { display: none; }
        }
      `}</style>
    </section>
  );
});
