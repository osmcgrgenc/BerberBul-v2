import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
