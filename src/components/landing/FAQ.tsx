import { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { faqItems } from '../../config/faq';

export const FAQ = memo(function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useInView();

  const toggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      ref={ref}
      style={{
        padding: '120px 0',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Two column layout like KAIF */}
        <div
          className="faq-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left column - FAQ */}
          <div>
            {/* Header - KAIF style */}
            <div
              className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ marginBottom: '48px' }}
            >
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                {t('faq.title')}
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {t('faq.subtitle') || 'Everything you need to know about our services'}
              </p>
            </div>

            {/* FAQ items - KAIF style with border bottom */}
            <div>
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transitionDelay: `${index * 0.08}s`,
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '24px',
                        padding: '24px 0',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {/* Question */}
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {t(item.questionKey)}
                      </span>

                      {/* Toggle icon */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isOpen ? (
                          <Minus size={14} color="var(--text-primary)" />
                        ) : (
                          <Plus size={14} color="var(--text-primary)" />
                        )}
                      </div>
                    </button>

                    {/* Answer */}
                    <div
                      style={{
                        display: isOpen ? 'block' : 'none',
                      }}
                    >
                      <p
                        style={{
                          paddingBottom: '24px',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.7,
                        }}
                      >
                        {t(item.answerKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column - Support cards like KAIF */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* WhatsApp card */}
            <div
              className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{
                padding: '28px',
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                transitionDelay: '0.2s',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}
              >
                WhatsApp
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {t('faq.whatsappDesc') || 'Quick responses in messenger. Booking, questions, support - all in one chat.'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {t('faq.instantReply') || 'Instant replies'}
              </p>
            </div>

            {/* Consultation card */}
            <div
              className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{
                padding: '28px',
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                transitionDelay: '0.3s',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}
              >
                {t('faq.consultationTitle') || 'Free Consultation'}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {t('faq.consultationDesc') || "Individual approach to each case. We'll help find the best solution."}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Thailand
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .faq-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
});
