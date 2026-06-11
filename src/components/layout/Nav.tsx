import { useState, useEffect, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'th', label: 'TH', name: 'ไทย' },
];

/** Editorial wordmark — display face with an emerald accent dot. */
function Wordmark({ size = '1.35rem' }: { size?: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '-0.03em',
        color: 'var(--ink)',
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
    >
      ThaiResolve
      <span style={{ color: 'var(--accent)' }}>.</span>
    </span>
  );
}

export const Nav = memo(function Nav() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('lang', langCode);
    setIsLangMenuOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const navLinks = [
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.howItWorks'), id: 'steps' },
    { label: t('nav.faq'), id: 'faq' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: isScrolled ? 'rgba(242,241,236,0.82)' : 'transparent',
          backdropFilter: isScrolled ? 'saturate(180%) blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'saturate(180%) blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--line)' : '1px solid transparent',
          transition: 'background 0.4s var(--ease-expo), border-color 0.4s ease',
        }}
      >
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '76px',
            }}
          >
            <a href="#" style={{ zIndex: 101 }} aria-label="ThaiResolve">
              <Wordmark />
            </a>

            {/* Desktop nav */}
            <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '36px' }}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="nav-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 101 }}>
              <div ref={langMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="lang-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                  }}
                >
                  {currentLang.label}
                  <ChevronDown
                    size={13}
                    style={{
                      transform: isLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s var(--ease-expo)',
                    }}
                  />
                </button>

                {isLangMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'var(--paper-card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      boxShadow: '0 18px 48px rgba(13,15,14,0.14)',
                      overflow: 'hidden',
                      minWidth: '140px',
                      animation: 'dropdownFadeIn 0.18s var(--ease-expo)',
                    }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '12px 16px',
                          fontSize: '0.8125rem',
                          fontWeight: currentLang.code === lang.code ? 600 : 400,
                          color: currentLang.code === lang.code ? 'var(--ink)' : 'var(--text-secondary)',
                          background: currentLang.code === lang.code ? 'var(--paper-dim)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>{lang.label}</span>
                        <span style={{ opacity: 0.6 }}>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="desktop-cta btn-pill"
                onClick={() => scrollToSection('form')}
                style={{
                  display: 'none',
                  padding: '12px 22px',
                  color: '#fff',
                  background: 'var(--ink)',
                  border: 'none',
                }}
              >
                {t('nav.getHelp')}
                <ArrowUpRight size={15} />
              </button>

              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
                style={{
                  display: 'flex',
                  padding: '8px',
                  color: 'var(--ink)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen mobile menu */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'var(--paper)',
          display: 'flex',
          flexDirection: 'column',
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.4s var(--ease-expo), visibility 0.4s ease',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '120px var(--pad-x) 32px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="mobile-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  padding: '20px 0',
                  color: 'var(--ink)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--line)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.25rem, 9vw, 3.25rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s var(--ease-expo) ${0.1 + index * 0.08}s, transform 0.5s var(--ease-expo) ${0.1 + index * 0.08}s`,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-body)', color: 'var(--accent)', fontWeight: 600 }}>
                    0{index + 1}
                  </span>
                  {link.label}
                </span>
                <ArrowRight size={22} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('form')}
            className="mobile-cta btn-pill"
            style={{
              marginTop: '40px',
              padding: '20px 32px',
              background: 'var(--ink)',
              color: '#fff',
              border: 'none',
              justifyContent: 'center',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.5s var(--ease-expo) 0.34s, transform 0.5s var(--ease-expo) 0.34s',
            }}
          >
            {t('nav.getHelp')}
            <ArrowUpRight size={18} />
          </button>
        </div>

        <div style={{ padding: 'var(--pad-x)', borderTop: '1px solid var(--line)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            {t('hero.eyebrow')}
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
});
