import { forwardRef } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, onClick, type = 'button' }, ref) => {

    const getStyles = () => {
      const base: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
      };

      if (variant === 'primary') {
        return {
          ...base,
          background: 'linear-gradient(135deg, #C4654A 0%, #D4856A 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 20px rgba(196, 101, 74, 0.3)',
        };
      }

      if (variant === 'secondary') {
        return {
          ...base,
          background: 'transparent',
          color: '#C4654A',
          borderRadius: '12px',
          border: '2px solid rgba(196, 101, 74, 0.4)',
        };
      }

      return {
        ...base,
        background: 'transparent',
        color: '#5C524A',
        border: 'none',
        borderRadius: '8px',
      };
    };

    const getSizeStyles = (): React.CSSProperties => {
      if (size === 'sm') return { padding: '10px 20px', fontSize: '14px' };
      if (size === 'lg') return { padding: '20px 40px', fontSize: '18px' };
      return { padding: '14px 28px', fontSize: '16px' };
    };

    return (
      <button
        ref={ref}
        type={type}
        style={{ ...getStyles(), ...getSizeStyles() }}
        className={`btn-scale ${className}`}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <svg
            style={{ animation: 'spin 1s linear infinite', marginRight: '8px', width: '16px', height: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
