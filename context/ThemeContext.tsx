import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: '#f4f6f9',
  card: '#ffffff',
  text: '#333333',
  subText: '#888888',
  border: '#dddddd',
  primary: '#2980b9',
  income: '#2ecc71',
  expense: '#e74c3c',
  tabBar: '#ffffff',
  header: '#ffffff',
  input: '#fafafa',
};

const darkColors = {
  background: '#1a1a2e',
  card: '#16213e',
  text: '#ffffff',
  subText: '#aaaaaa',
  border: '#333333',
  primary: '#2980b9',
  income: '#2ecc71',
  expense: '#e74c3c',
  tabBar: '#16213e',
  header: '#16213e',
  input: '#0f3460',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);