import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTACTS } from '../../config/constants';

export const Footer = memo(function Footer() {
  const { t } = useTranslation();

  const contactLinks = [
    { label: 'WhatsApp', href: CONTACTS.whatsapp },
    { label: 'Telegram', href: CONTACTS.telegram },
    { label: 'Line', href: CONTACTS.line },
    { label: 'Email', href: `mailto:${CONTACTS.email}` },
  ];

  return (
    <footer
      style={{
        padding: '64px 0 32px',
        background: '#F7F8F7',
        borderTop: '1px solid #E5E8E8',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Top section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Logo - KAIF style */}
          <div>
            <a href="#" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1E3A3A',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Thai<span style={{ fontWeight: 400 }}>Resolve</span>
              </span>
            </a>
            <p
              style={{
                marginTop: '16px',
                fontSize: '14px',
                color: '#5A6B6B',
                maxWidth: '280px',
                lineHeight: 1.6,
              }}
            >
              {t('footer.disclaimer')}
            </p>
          </div>

          {/* Contact links */}
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#5A6B6B',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E8E8',
          }}
        >
          <p style={{ fontSize: '12px', color: '#8A9A9A' }}>
            {t('footer.copyright')}
          </p>
          <p style={{ fontSize: '12px', color: '#8A9A9A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Thailand
          </p>
        </div>
      </div>
    </footer>
  );
});
