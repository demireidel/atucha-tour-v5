import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AppState {
  // Core visualization toggles
  exploded: boolean
  annotations: boolean
  aboutModalOpen: boolean

  // Advanced features
  quality: "low" | "medium" | "high" | "ultra"
  wireframe: boolean
  shadows: boolean

  // Camera and interaction
  cameraPosition: [number, number, number]
  autoRotate: boolean

  // Performance monitoring
  fps: number

  // Actions
  setExploded: (exploded: boolean) => void
  setAnnotations: (annotations: boolean) => void
  setAboutModalOpen: (open: boolean) => void
  setQuality: (quality: "low" | "medium" | "high" | "ultra") => void
  setWireframe: (wireframe: boolean) => void
  setShadows: (shadows: boolean) => void
  setCameraPosition: (position: [number, number, number]) => void
  setAutoRotate: (autoRotate: boolean) => void
  setFps: (fps: number) => void

  // Utility actions
  resetView: () => void
  toggleExploded: () => void
}

const defaultCameraPosition: [number, number, number] = [50, 30, 50]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Core state
      exploded: false,
      annotations: true,
      aboutModalOpen: false,

      // Advanced features
      quality: "high",
      wireframe: false,
      shadows: true,

      // Camera and interaction
      cameraPosition: defaultCameraPosition,
      autoRotate: false,

      // Performance
      fps: 60,

      // Actions
      setExploded: (exploded) => set({ exploded }),
      setAnnotations: (annotations) => set({ annotations }),
      setAboutModalOpen: (aboutModalOpen) => set({ aboutModalOpen }),
      setQuality: (quality) => set({ quality }),
      setWireframe: (wireframe) => set({ wireframe }),
      setShadows: (shadows) => set({ shadows }),
      setCameraPosition: (cameraPosition) => set({ cameraPosition }),
      setAutoRotate: (autoRotate) => set({ autoRotate }),
      setFps: (fps) => set({ fps }),

      // Utility actions
      resetView: () =>
        set({
          cameraPosition: defaultCameraPosition,
          exploded: false,
          autoRotate: false,
        }),
      toggleExploded: () => set((state) => ({ exploded: !state.exploded })),
    }),
    {
      name: "atucha-store",
      partialize: (state) => ({
        exploded: state.exploded,
        annotations: state.annotations,
        quality: state.quality,
        wireframe: state.wireframe,
        shadows: state.shadows,
        autoRotate: state.autoRotate,
      }),
    },
  ),
)
