import { useState, useEffect, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'th', label: 'TH', name: 'ไทย' },
];

export const Nav = memo(function Nav() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('lang', langCode);
    setIsLangMenuOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    // Small delay to allow menu close animation
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
          background: isScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.85)',
          borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '80px',
            }}
          >
            {/* Logo */}
            <a href="#" style={{ textDecoration: 'none', zIndex: 101 }}>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s ease',
                }}
              >
                Thai<span style={{ fontWeight: 400 }}>Resolve</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div
              className="desktop-nav"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '40px',
              }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="nav-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 101 }}>
              {/* Language Dropdown */}
              <div ref={langMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="lang-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {currentLang.label}
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isLangMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      overflow: 'hidden',
                      minWidth: '120px',
                      zIndex: 1000,
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
                          fontSize: '13px',
                          fontWeight: currentLang.code === lang.code ? 600 : 400,
                          color: currentLang.code === lang.code ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: currentLang.code === lang.code ? 'var(--bg-primary)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (currentLang.code !== lang.code) {
                            e.currentTarget.style.background = 'var(--bg-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentLang.code !== lang.code) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>{lang.label}</span>
                        <span style={{ opacity: 0.7 }}>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA - Desktop */}
              <button
                className="desktop-cta btn-scale"
                onClick={() => scrollToSection('form')}
                style={{
                  display: 'none',
                  padding: '12px 24px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {t('nav.getHelp')}
              </button>

              {/* Mobile menu button */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: 'flex',
                  padding: '8px',
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        {/* Menu Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '120px 32px 32px',
          }}
        >
          {/* Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="mobile-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 0',
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  textAlign: 'left',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
                }}
              >
                {link.label}
                <ArrowRight size={20} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('form')}
            className="mobile-cta"
            style={{
              marginTop: '48px',
              padding: '20px 32px',
              background: 'var(--text-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s',
            }}
          >
            {t('nav.getHelp')}
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Bottom Info */}
        <div
          style={{
            padding: '32px',
            borderTop: '1px solid var(--border)',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.4s ease 0.4s',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {t('footer.tagline', 'Professional assistance in Thailand')}
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: block !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }

        .mobile-nav-item:active {
          background: var(--bg-primary);
        }

        .mobile-cta:active {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
});
