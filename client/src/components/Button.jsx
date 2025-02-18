import React from 'react';

export default function Button({
  text,
  onClick,
  variant = 'primary', // Primary by default
  className = '',
}) {
  const buttonClasses = {
    primary: `bg-accent-light text-text-light dark:text-text-dark hover:bg-accent-dark`,
    secondary: `border border-secondary-light dark:border-secondary-dark text-text-light dark:text-text-dark hover:border-accent-light hover:bg-accent-light`,
  };

  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-lg shadow-lg transition duration-200 ease-in-out ${buttonClasses[variant]} ${className}`}
    >
      {text}
    </button>
  );
}
