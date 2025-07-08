import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'font-medium transition-all duration-200 transform shadow-md';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-white hover:bg-gray-50 text-primary border-2 border-primary',
  };

  const sizeClasses = {
    sm: 'py-2 px-4 rounded-md text-sm',
    md: 'py-3 px-6 rounded-lg',
    lg: 'py-4 px-8 rounded-xl text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner size="sm" />
          <span className="ml-2">Yükleniyor...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
