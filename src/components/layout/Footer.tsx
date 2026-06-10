import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

export const Footer = memo(function Footer() {
  const { t } = useTranslation();

  const scrollToForm = () => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer
      data-surface="dark"
      style={{ position: 'relative', paddingTop: 'clamp(72px, 12vh, 140px)' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
        {/* CTA band */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 5vh, 56px)', paddingBottom: 'clamp(56px, 9vh, 100px)' }}>
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="eyebrow__dot" />
            {t('footer.eyebrow')}
          </span>
          <button
            onClick={scrollToForm}
            data-cursor
            style={{
              alignSelf: 'flex-start',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#fff',
            }}
          >
            {t('footer.ctaLine')}
            <span style={{ color: 'var(--accent-light)' }}>.</span>
          </button>
          <p
            style={{
              maxWidth: 540,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {t('footer.ctaSub')}
          </p>
          <button
            onClick={scrollToForm}
            data-cursor
            className="btn-pill btn-scale"
            style={{
              alignSelf: 'flex-start',
              padding: '20px 34px',
              background: 'var(--accent-light)',
              color: 'var(--ink)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('footer.ctaButton')}
            <ArrowUpRight size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--line-dark)' }} />

        {/* Links band */}
        <div
          className="footer-band"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '40px',
            padding: 'clamp(40px, 6vh, 64px) 0',
          }}
        >
          <div style={{ maxWidth: 360 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: '#fff',
              }}
            >
              ThaiResolve<span style={{ color: 'var(--accent-light)' }}>.</span>
            </span>
            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              {t('footer.disclaimer')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(32px, 5vw, 72px)', flexWrap: 'wrap' }}>
            <FooterCol title={t('footer.navTitle')}>
              <FooterLink href="#services">{t('nav.services')}</FooterLink>
              <FooterLink href="#steps">{t('nav.howItWorks')}</FooterLink>
              <FooterLink href="#faq">{t('nav.faq')}</FooterLink>
              <FooterLink href="#form">{t('nav.getHelp')}</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--line-dark)' }} />

        {/* Legal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '28px 0 36px',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t('footer.copyright')}</p>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            🇹🇭 Thailand · Asia
          </p>
        </div>
      </div>
    </footer>
  );
});

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <span
        style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '4px',
        }}
      >
        {title}
      </span>
      {children}
    </div>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="footer-link"
      data-cursor
      style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)' }}
    >
      {children}
    </a>
  );
}
