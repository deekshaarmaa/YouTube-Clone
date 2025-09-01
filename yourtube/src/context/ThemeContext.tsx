'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  // fetch theme from backend (IP + time based)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/otp/theme");
        const data = await res.json();
        if (data?.ok && (data.theme === "light" || data.theme === "dark")) {
          setTheme(data.theme);
        }
      } catch {}
    };
    run();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
};

export const useTheme = () => {
  const v = useContext(ThemeContext);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
};
