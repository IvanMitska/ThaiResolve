import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ label, options, error, placeholder, value, onChange, name, required }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Sync with external value
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
      <div
        ref={containerRef}
        className="form-field"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}
      >
        <label
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </label>

        {/* Hidden input for form submission */}
        <input
          ref={inputRef}
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
        />

        {/* Custom select button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '14px 16px',
            paddingRight: '44px',
            background: '#FFFFFF',
            border: error ? '1px solid var(--error)' : isOpen ? '1px solid var(--text-primary)' : '1px solid var(--border)',
            borderRadius: '8px',
            color: selectedValue ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.2s ease',
          }}
        >
          {selectedOption?.label || placeholder || 'Выберите...'}
          <ChevronDown
            size={18}
            color="var(--text-secondary)"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(30, 58, 58, 0.12)',
              zIndex: 50,
              overflow: 'hidden',
              animation: 'dropdownFadeIn 0.15s ease',
            }}
          >
            <div style={{ padding: '8px 0', maxHeight: '280px', overflowY: 'auto' }}>
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? 'var(--bg-primary)' : 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--bg-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check size={16} color="var(--text-primary)" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: '13px', color: 'var(--error)' }}>
            {error}
          </p>
        )}

        <style>{`
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

Select.displayName = 'Select';
