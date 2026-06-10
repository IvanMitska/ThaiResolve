import { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { Eyebrow } from '../ui/Eyebrow';
import { faqItems } from '../../config/faq';

export const FAQ = memo(function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useInView();

  const toggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      ref={ref}
      style={{ padding: 'clamp(90px, 14vh, 160px) 0', position: 'relative' }}
    >
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--pad-x)' }}>
        <div
          className="faq-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '0.85fr 1.15fr',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'start',
          }}
        >
          {/* Left — sticky header + contact prompt */}
          <div
            className={`faq-aside animate-on-scroll ${isVisible ? 'visible' : ''}`}
            style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <Eyebrow num="05">{t('faq.label')}</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 500,
                letterSpacing: '-0.035em',
                lineHeight: 1.02,
                color: 'var(--ink)',
              }}
            >
              {t('faq.title')}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 320 }}>
              {t('faq.subtitle')}
            </p>
            <a
              href="#form"
              className="btn-pill btn-scale"
              data-cursor
              style={{
                alignSelf: 'flex-start',
                marginTop: '8px',
                padding: '16px 26px',
                color: '#fff',
                background: 'var(--ink)',
              }}
            >
              {t('faq.ask')}
              <span style={{ color: 'var(--accent-light)' }}>→</span>
            </a>
          </div>

          {/* Right — accordion */}
          <div className="faq-panel" style={{ borderTop: '1px solid var(--line)' }}>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
                  style={{ borderBottom: '1px solid var(--line)', transitionDelay: `${index * 0.06}s` }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    data-cursor
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '24px',
                      padding: 'clamp(20px, 2.6vw, 30px) 0',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.125rem, 1.9vw, 1.5rem)',
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: isOpen ? 'var(--accent)' : 'var(--ink)',
                        transition: 'color 0.3s var(--ease-snap)',
                      }}
                    >
                      {t(item.questionKey)}
                    </span>
                    <span
                      className="faq-toggle"
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--line)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? 'var(--accent)' : 'var(--ink)',
                        transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)',
                        transition: 'transform 0.4s var(--ease-expo), border-color 0.3s ease, color 0.3s ease',
                      }}
                    >
                      <Plus size={18} strokeWidth={1.75} />
                    </span>
                  </button>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.45s var(--ease-expo)',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p
                        style={{
                          paddingBottom: 'clamp(22px, 2.6vw, 30px)',
                          paddingRight: '64px',
                          fontSize: '0.9375rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.7,
                          maxWidth: 560,
                        }}
                      >
                        {t(item.answerKey)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        /* Frosted paper sheet that keeps text readable over the 3D hand
           while letting it stay as a faint texture behind. */
        .faq-panel { position: relative; isolation: isolate; }
        .faq-panel::before {
          content: '';
          position: absolute;
          inset: -10px clamp(-16px, -2vw, -28px);
          border-radius: 20px;
          background: rgba(242, 241, 236, 0.78);
          -webkit-backdrop-filter: blur(8px) saturate(1.05);
          backdrop-filter: blur(8px) saturate(1.05);
          z-index: -1;
          pointer-events: none;
        }
        /* Graceful fallback where backdrop-filter is unsupported */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .faq-panel::before { background: rgba(242, 241, 236, 0.94); }
        }
        @media (max-width: 860px) {
          .faq-layout { grid-template-columns: 1fr !important; }
          .faq-aside { position: static !important; }
          /* Slightly stronger veil on phones for guaranteed legibility */
          .faq-panel::before {
            inset: -10px -16px;
            background: rgba(242, 241, 236, 0.86);
          }
        }
      `}</style>
    </section>
  );
});
