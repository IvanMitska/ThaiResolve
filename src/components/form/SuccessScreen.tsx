import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { CONTACTS } from '../../config/constants';

interface SuccessScreenProps {
  onReset: () => void;
}

export const SuccessScreen = memo(function SuccessScreen({ onReset }: SuccessScreenProps) {
  const { t } = useTranslation();

  const contactLinks = [
    { label: 'WhatsApp', href: CONTACTS.whatsapp },
    { label: 'Telegram', href: CONTACTS.telegram },
    { label: 'Line', href: CONTACTS.line },
  ];

  return (
    <section
      style={{
        padding: '120px 0',
        background: '#FFFFFF',
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Success icon */}
        <div
          className="animate-fade-in-up delay-1"
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 28px',
            borderRadius: '50%',
            background: 'rgba(90, 143, 90, 0.1)',
            border: '1px solid rgba(90, 143, 90, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={32} color="#5A8F5A" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px',
            fontWeight: 500,
            color: '#2C2420',
            marginBottom: '12px',
          }}
        >
          {t('success.title')}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: '15px',
            color: '#5C524A',
            marginBottom: '40px',
            lineHeight: 1.6,
          }}
        >
          {t('success.message')}
        </p>

        {/* Contact links */}
        <p
          style={{
            fontSize: '14px',
            color: '#8C8078',
            marginBottom: '16px',
          }}
        >
          {t('success.contact')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2C2420',
                background: 'transparent',
                border: '1px solid #E0DAD2',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C4654A';
                e.currentTarget.style.color = '#C4654A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0DAD2';
                e.currentTarget.style.color = '#2C2420';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          style={{
            marginTop: '40px',
            fontSize: '14px',
            color: '#8C8078',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C4654A')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8078')}
        >
          {t('error.retry')}
        </button>
      </div>
    </section>
  );
});
