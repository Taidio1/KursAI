import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-all group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-slate-600 group-hover:scale-110 transition-transform" />
      ) : (
        <Sun size={18} className="text-amber-400 group-hover:scale-110 group-hover:rotate-45 transition-transform" />
      )}
    </button>
  );
}
