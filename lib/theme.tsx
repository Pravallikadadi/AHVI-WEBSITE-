"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "ahvi-theme";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark" || current === "light") setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist across visits.
    }
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Sets data-theme before first paint (stored choice, else system preference) so there's no flash of the wrong theme. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
