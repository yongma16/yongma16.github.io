import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yma16-theme') as ThemeMode;
      return saved || 'auto';
    }
    return 'auto';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      let dark: boolean;
      if (theme === 'auto') {
        dark = mediaQuery.matches;
      } else {
        dark = theme === 'dark';
      }
      setIsDark(dark);
      
      // 应用主题到 document
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    updateTheme();

    // 监听系统主题变化
    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        updateTheme();
      }
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('yma16-theme', newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'auto') {
      // 如果当前是auto，切换到与当前相反的模式
      setTheme(isDark ? 'light' : 'dark');
    } else {
      // 在 light -> dark -> auto 之间循环
      const modes: ThemeMode[] = ['light', 'dark', 'auto'];
      const currentIndex = modes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % modes.length;
      setTheme(modes[nextIndex]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
