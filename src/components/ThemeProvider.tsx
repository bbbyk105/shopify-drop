"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // localStorageからテーマを読み込む
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // システムの設定を確認
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };

  // マウント前でもコンテキストを提供（デフォルト値を使用）
  const contextValue = {
    theme: mounted ? theme : "light",
    setTheme: updateTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
