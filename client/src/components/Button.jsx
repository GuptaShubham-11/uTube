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
    primary: `bg-accent-light cursor-pointer font-semibold`,
    secondary: `border border-secondary-light dark:border-secondary-dark cursor-pointer font-semibold`,
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading} // Disable button when loading
      className={`${className} rounded-lg transition duration-200 hover:brightness-110 ease-in-out ${buttonClasses[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? <Spinner /> : text}
    </button>
  );
}
