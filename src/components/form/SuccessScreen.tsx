import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
}

export const SuccessScreen = memo(function SuccessScreen({ onReset }: SuccessScreenProps) {
  const { t } = useTranslation();

  return (
    <section
      style={{
        padding: '120px 0',
        position: 'relative',
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
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={32} color="#FFFFFF" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            marginBottom: '12px',
          }}
        >
          {t('success.title')}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            lineHeight: 1.6,
          }}
        >
          {t('success.message')}
        </p>

        {/* Reset */}
        <button
          onClick={onReset}
          style={{
            marginTop: '40px',
            fontSize: '14px',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {t('error.retry')}
        </button>
      </div>
    </section>
  );
});
