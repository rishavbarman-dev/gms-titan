import React, { useState } from 'react';
import { cn } from './Button';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  const isPassword = props.type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-1.5 relative">
      {label && <label className="text-sm font-medium text-white/60 ml-1">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'input-field',
            isPassword && 'pr-10',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

const Card = ({ children, className, title, subtitle, icon: Icon }) => {
  return (
    <div className={cn('glass-card', className)}>
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="p-3 rounded-xl bg-brand/10 text-brand">
              <Icon size={24} />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export { Input, Card };
