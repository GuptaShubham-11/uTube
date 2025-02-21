import React from 'react';
import { Spinner } from './';

export default function Button({
  text,
  onClick,
  variant = 'primary', // Primary by default
  className = '',
  isLoading = false, // Added prop to manage loading state
}) {
  const buttonClasses = {
    primary: `bg-accent-light text-text-light dark:text-text-dark hover:bg-accent-dark cursor-pointer font-semibold`,
    secondary: `border border-secondary-light dark:border-secondary-dark text-text-light dark:text-text-dark hover:bg-primary-light cursor-pointer font-semibold`,
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading} // Disable button when loading
      className={`${className} px-4 py-4 rounded-lg shadow-lg transition duration-200 ease-in-out ${buttonClasses[variant]} ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? <Spinner /> : text}
    </button>
  );
}
