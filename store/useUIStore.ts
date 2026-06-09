import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIMode = "OPTIMISTIC" | "REALISTIC" | "MENTOR" | "ENTREPRENEUR" | "CREATIVE";

interface UIState {
  sidebarCollapsed: boolean;
  aiMode: AIMode;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setAIMode: (mode: AIMode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      aiMode: "MENTOR",
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      setAIMode: (mode) => set({ aiMode: mode }),
    }),
    {
      name: "echoes-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        aiMode: state.aiMode,
      }),
    }
  )
);
