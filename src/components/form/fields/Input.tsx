import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#1E3A3A',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </label>
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#FFFFFF',
            border: error ? '1px solid #C4544A' : '1px solid #E5E8E8',
            borderRadius: '8px',
            color: '#1E3A3A',
            fontSize: '14px',
            outline: 'none',
          }}
          {...props}
        />
        {error && (
          <p style={{ fontSize: '13px', color: '#C4544A' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
