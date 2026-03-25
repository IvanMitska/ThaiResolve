import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Nav = memo(function Nav() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

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
          background: isScrolled ? '#FFFFFF' : 'transparent',
          borderBottom: isScrolled ? '1px solid #E5E8E8' : '1px solid transparent',
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
                  color: isScrolled || isMobileMenuOpen ? '#1E3A3A' : '#FFFFFF',
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
                    color: isScrolled ? '#5A6B6B' : 'rgba(255, 255, 255, 0.8)',
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
              {/* Language */}
              <button
                onClick={toggleLanguage}
                className="lang-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: isScrolled || isMobileMenuOpen ? '#5A6B6B' : 'rgba(255, 255, 255, 0.8)',
                  background: 'transparent',
                  border: isScrolled || isMobileMenuOpen ? '1px solid #E5E8E8' : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                }}
              >
                {i18n.language === 'ru' ? 'EN' : 'RU'}
              </button>

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
                  background: '#1E3A3A',
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
                  color: isScrolled || isMobileMenuOpen ? '#1E3A3A' : '#FFFFFF',
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
                  color: '#1E3A3A',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #E5E8E8',
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
                <ArrowRight size={20} color="#8A9A9A" />
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
              background: '#1E3A3A',
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
            borderTop: '1px solid #E5E8E8',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.4s ease 0.4s',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#8A9A9A',
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
          background: #F7F8F7;
        }

        .mobile-cta:active {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
});
