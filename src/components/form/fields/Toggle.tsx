import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, checked, ...props }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#5C524A',
          }}
        >
          {label}
        </span>
        <label
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
            {...props}
          />
          <div
            style={{
              width: '52px',
              height: '28px',
              background: checked ? 'rgba(196, 101, 74, 0.15)' : '#F5F2ED',
              border: checked ? '1px solid rgba(196, 101, 74, 0.3)' : '1px solid #E0DAD2',
              borderRadius: '14px',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: checked ? '26px' : '2px',
                width: '22px',
                height: '22px',
                background: checked ? '#C4654A' : '#8C8078',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 500,
                color: checked ? '#FFFFFF' : '#F5F2ED',
              }}
            >
              {checked ? t('common.yes') : t('common.no')}
            </div>
          </div>
        </label>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
