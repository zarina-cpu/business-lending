"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-full border border-line px-3 py-1.5 text-sm text-fg transition hover:border-copper hover:text-copper ${className}`}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {isDark ? "Светлая" : "Тёмная"}
    </button>
  );
}
