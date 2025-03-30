// @ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  showClock: boolean;
  setDarkMode: (isDark: boolean) => void;
  setShowClock: (show: boolean) => void;
}

const useThemeStore = create<ThemeState>(
  persist(
    (set) => ({
      isDarkMode: false,
      showClock: true,
      setDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),
      setShowClock: (show: boolean) => set({ showClock: show }),
    }),
    {
      name: "theme-storage",
    },
  ),
);

export default useThemeStore;
