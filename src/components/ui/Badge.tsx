interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pulse';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2.5
        px-5 py-2.5
        rounded-full
        bg-gradient-to-r from-gold/15 to-gold/5
        border border-gold/25
        text-gold-light text-sm font-medium
        backdrop-blur-sm
        shadow-[0_0_20px_rgba(200,165,90,0.1)]
        ${className}
      `}
    >
      {variant === 'pulse' && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-gold to-gold-light" />
        </span>
      )}
      {children}
    </div>
  );
}
