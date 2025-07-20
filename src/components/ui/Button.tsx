// 🔱 DIVINE BUTTON COMPONENT v3.0
// Enterprise-grade button with comprehensive variants and accessibility

import React, { forwardRef } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import type { ButtonProps } from '@/types';

// ===== BUTTON VARIANTS =====
const buttonVariants = {
  // Base styles
  base: 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
  
  // Variants
  variants: {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 dark:border-purple-400 dark:text-purple-400',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
  },
  
  // Sizes
  sizes: {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl',
    xl: 'px-8 py-4 text-xl rounded-2xl'
  }
};

// ===== MOTION VARIANTS =====
const motionVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  loading: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ===== BUTTON COMPONENT =====
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & MotionProps
>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  id,
  'data-testid': testId,
  ...motionProps
}, ref) => {
  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Build className
  const buttonClassName = clsx(
    buttonVariants.base,
    buttonVariants.variants[variant],
    buttonVariants.sizes[size],
    {
      'cursor-not-allowed': isDisabled,
      'pointer-events-none': loading
    },
    className
  );

  // Handle click with loading state
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || !onClick) return;
    onClick();
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      id={id}
      data-testid={testId}
      className={buttonClassName}
      disabled={isDisabled}
      onClick={handleClick}
      variants={motionVariants}
      initial="initial"
      whileHover={!isDisabled ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
      animate={loading ? "loading" : "initial"}
      {...motionProps}
    >
      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </motion.div>
      )}
      
      {/* Button Content */}
      <motion.span
        className={clsx(
          'flex items-center gap-2',
          loading && 'opacity-0'
        )}
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
});

Button.displayName = 'Button';

// ===== BUTTON GROUP COMPONENT =====
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  spacing = 'sm'
}) => {
  const groupClassName = clsx(
    'flex',
    {
      'flex-row': orientation === 'horizontal',
      'flex-col': orientation === 'vertical',
      'gap-1': spacing === 'sm',
      'gap-2': spacing === 'md',
      'gap-3': spacing === 'lg',
      'gap-0': spacing === 'none'
    },
    className
  );

  return (
    <div className={groupClassName} role="group">
      {children}
    </div>
  );
};

// ===== ICON BUTTON COMPONENT =====
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  'aria-label': ariaLabel,
  tooltip,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}, ref) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <Button
      ref={ref}
      size={size}
      variant={variant}
      className={clsx('p-2', className)}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      {...props}
    >
      <span className={iconSizes[size]}>
        {icon}
      </span>
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// ===== LOADING BUTTON COMPONENT =====
interface LoadingButtonProps extends ButtonProps {
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loadingText = 'Loading...',
  loading,
  ...props
}) => {
  return (
    <Button loading={loading} {...props}>
      {loading ? loadingText : children}
    </Button>
  );
};

// ===== EXPORTS =====
export default Button;