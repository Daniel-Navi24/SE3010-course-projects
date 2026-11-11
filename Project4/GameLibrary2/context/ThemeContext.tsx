import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_THEME_KEY,
  Theme,
  themes,
} from "../theme/themes";

const STORAGE_KEY = "@criminal_intent/theme";

type ThemeContextValue = {
  theme: Theme;
  themeKey: string;
  setThemeKey: (key: string) => Promise<void>;
  ready: boolean; // true once we've loaded from storage
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<string>(DEFAULT_THEME_KEY);
  const [ready, setReady] = useState(false);

  // Load persisted theme once on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && themes[stored]) {
          setThemeKeyState(stored);
        }
      } catch (err) {
        console.warn("Failed to load theme:", err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Change + persist theme
  const setThemeKey = useCallback(async (key: string) => {
    if (!themes[key]) return;
    setThemeKeyState(key);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, key);
    } catch (err) {
      console.warn("Failed to save theme:", err);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeKey] ?? themes[DEFAULT_THEME_KEY],
      themeKey,
      setThemeKey,
      ready,
    }),
    [themeKey, setThemeKey, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return ctx;
}
