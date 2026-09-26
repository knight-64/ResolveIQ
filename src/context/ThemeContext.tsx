/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'black' | 'midnight_red';

interface ThemeContextType {
  theme: ThemeMode;
  isMidnight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'resolveiq_theme_v2';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'black' || stored === 'midnight_red') {
        return stored;
      }
      return 'black';
    }
    return 'black';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Always apply dark & black-red-white data attributes
    root.classList.add('dark');
    root.classList.add('theme-black');
    root.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'black' ? 'midnight_red' : 'black'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isMidnight: true, // Always true for dark/black base
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
