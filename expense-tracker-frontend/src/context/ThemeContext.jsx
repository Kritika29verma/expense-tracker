import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

const light = {
  isDark: false,
  bg: '#f1f5f9',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  text: '#1e293b',
  textSec: '#475569',
  textMuted: '#94a3b8',
  accent: '#6366f1',
  accentBg: 'rgba(99,102,241,0.08)',
  accentBorder: 'rgba(99,102,241,0.2)',
  navbar: 'rgba(255,255,255,0.92)',
  inputBg: '#f8fafc',
  inputBorder: '#e2e8f0',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)',
  divider: '#e2e8f0',
  income: '#10b981', incomeBg: 'rgba(16,185,129,0.09)', incomeBorder: 'rgba(16,185,129,0.2)',
  expense: '#ef4444', expenseBg: 'rgba(239,68,68,0.09)', expenseBorder: 'rgba(239,68,68,0.2)',
  balance: '#6366f1', balanceBg: 'rgba(99,102,241,0.08)', balanceBorder: 'rgba(99,102,241,0.2)',
  tooltipBg: '#ffffff', tooltipBorder: '#e2e8f0', tooltipText: '#1e293b',
  pieText: '#475569',
  rowBg: '#f8fafc', rowBorder: '#e2e8f0',
  badgeBg: '#f1f5f9',
};

const dark = {
  isDark: true,
  bg: '#0f172a',
  card: '#1e293b',
  cardBorder: 'rgba(255,255,255,0.07)',
  text: '#f1f5f9',
  textSec: '#94a3b8',
  textMuted: '#64748b',
  accent: '#818cf8',
  accentBg: 'rgba(129,140,248,0.1)',
  accentBorder: 'rgba(129,140,248,0.25)',
  navbar: 'rgba(15,23,42,0.92)',
  inputBg: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.09)',
  shadow: '0 1px 3px rgba(0,0,0,0.3)',
  divider: 'rgba(255,255,255,0.07)',
  income: '#34d399', incomeBg: 'rgba(52,211,153,0.1)', incomeBorder: 'rgba(52,211,153,0.2)',
  expense: '#f87171', expenseBg: 'rgba(248,113,113,0.1)', expenseBorder: 'rgba(248,113,113,0.2)',
  balance: '#a5b4fc', balanceBg: 'rgba(165,180,252,0.1)', balanceBorder: 'rgba(165,180,252,0.2)',
  tooltipBg: '#1e293b', tooltipBorder: 'rgba(255,255,255,0.1)', tooltipText: '#f1f5f9',
  pieText: 'rgba(255,255,255,0.65)',
  rowBg: 'rgba(255,255,255,0.03)', rowBorder: 'rgba(255,255,255,0.07)',
  badgeBg: 'rgba(255,255,255,0.06)',
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? dark : light, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
