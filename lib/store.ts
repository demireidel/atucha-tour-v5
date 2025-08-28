import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AppState {
  // Core toggles
  exploded: boolean
  annotations: boolean
  aboutModalOpen: boolean

  // Actions
  setExploded: (exploded: boolean) => void
  setAnnotations: (annotations: boolean) => void
  setAboutModalOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Basic state
      exploded: false,
      annotations: true,
      aboutModalOpen: false,

      // Actions
      setExploded: (exploded) => set({ exploded }),
      setAnnotations: (annotations) => set({ annotations }),
      setAboutModalOpen: (aboutModalOpen) => set({ aboutModalOpen }),
    }),
    {
      name: "atucha-store",
      partialize: (state) => ({
        exploded: state.exploded,
        annotations: state.annotations,
      }),
    },
  ),
)
