/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

interface ThemeToggleProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'compact', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    const isPureBlack = theme === 'black';
    showToast({
      type: 'info',
      title: isPureBlack ? 'Crimson Obsidian Theme' : 'Pitch Black & Red Theme',
      description: isPureBlack
        ? 'Deep midnight black with crimson red and high-contrast white text.'
        : 'Pure pitch black with glowing red accents and crisp white typography.',
    });
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title="Toggle Black, Red & White Contrast"
        className={`relative p-2 rounded-lg transition-all flex items-center justify-center bg-black border border-red-900/60 text-red-500 hover:text-white hover:border-red-600 hover:bg-red-950/40 shadow-[0_0_12px_rgba(239,68,68,0.25)] ${className}`}
      >
        <Sparkles className="w-4 h-4 fill-red-500/20 stroke-[2.2]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all bg-black text-white hover:bg-red-950/30 border border-red-900/50 hover:border-red-600 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
        <span className="font-semibold text-white">Black & Red Mode</span>
      </div>
      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80 font-bold">
        {theme === 'black' ? 'PITCH' : 'CRIMSON'}
      </span>
    </button>
  );
}
