import { useEffect, useState, useCallback, memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const toggle = useCallback(() => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }, [currentTheme, setTheme]);

  // When mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="p-2 rounded-full hover:bg-accent/20 transition-colors"
    >
      {currentTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
};

export default memo(ThemeToggle);


