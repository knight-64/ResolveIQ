/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

interface ThemeToggleProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'compact', className = '' }: ThemeToggleProps) {
  const { theme, isMidnight, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    showToast({
      type: 'info',
      title: isMidnight ? 'Switched to Light Theme' : 'Switched to Midnight Theme',
      description: isMidnight
        ? 'High-visibility daylight palette activated.'
        : 'Deep contrast Midnight dark mode activated.',
    });
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isMidnight ? 'Switch to Light Theme' : 'Switch to Midnight Dark Theme'}
        className={`relative p-2 rounded-lg transition-all flex items-center justify-center ${
          isMidnight
            ? 'bg-neutral-900 border border-neutral-800 text-amber-300 hover:text-amber-200 hover:bg-neutral-800'
            : 'bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 shadow-2xs'
        } ${className}`}
      >
        {isMidnight ? (
          <Moon className="w-4 h-4 fill-amber-300/20 stroke-[2.2]" />
        ) : (
          <Sun className="w-4 h-4 stroke-[2.2]" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        isMidnight
          ? 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {isMidnight ? (
          <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-neutral-600" />
        )}
        <span className="font-semibold">{isMidnight ? 'Midnight Theme' : 'Light Theme'}</span>
      </div>
      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/50">
        {isMidnight ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
