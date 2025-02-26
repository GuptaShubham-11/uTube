import React, { useMemo } from 'react';
import { Spinner } from './';
import clsx from 'clsx';

export default function Button({
  onClick,
  variant = 'primary',
  className = '',
  isLoading = false,
  text,
  children,
}) {
  const buttonClasses = useMemo(
    () => ({
      primary: 'rounded-lg bg-accent-light text-white font-semibold justify-center',
      secondary:
        'rounded-lg border border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark font-semibold justify-center',
      text: 'px-4 w-full text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-700 ',
      danger:
        'px-4 w-full text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white',
    }),
    []
  );

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      aria-disabled={isLoading}
      className={clsx(
        className,
        'py-2 transition duration-200 ease-in-out flex items-center gap-2',
        buttonClasses[variant] || buttonClasses.primary,
        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 cursor-pointer'
      )}
    >
      {isLoading ? <Spinner /> : text || children}
    </button>
  );
}
