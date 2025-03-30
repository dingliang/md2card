// @ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  cardWidth: number;
  cardHeight: number;
  viewMode: "长卡片" | "短卡片";
  hideOverflow: boolean;
  selectedTheme: string;
  setCardWidth: (width: number) => void;
  setCardHeight: (height: number) => void;
  setViewMode: (tab: string) => void;
  setHideOverflow: (hide: boolean) => void;
  setSelectedTheme: (theme: string) => void;
}

const useSettingsStore = create<SettingsState>(
  persist(
    (set) => ({
      cardWidth: 440,
      cardHeight: 586,
      viewMode: "长卡片",
      hideOverflow: false,
      selectedTheme: "默认",
      setCardWidth: (width: number) => set({ cardWidth: width }),
      setCardHeight: (height: number) => set({ cardHeight: height }),
      setViewMode: (tab: string) => set({ viewMode: tab }),
      setHideOverflow: (hide: boolean) => set({ hideOverflow: hide }),
      setSelectedTheme: (theme: string) => set({ selectedTheme: theme }),
    }),
    {
      name: "settings1-storage",
    },
  ),
);

export default useSettingsStore;
