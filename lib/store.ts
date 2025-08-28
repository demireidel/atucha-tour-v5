import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Tour {
  id: string
  name: string
  description: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  keyframes: Array<{
    position: [number, number, number]
    target: [number, number, number]
    duration: number
    description?: string
  }>
}

export interface AppState {
  // Basic toggles
  exploded: boolean
  annotations: boolean
  aboutModalOpen: boolean

  // Layer management
  layers: {
    reactor: boolean
    turbine: boolean
    auxiliary: boolean
    switchyard: boolean
    water: boolean
    terrain: boolean
  }

  // Tour system
  currentTour: string | null
  tourProgress: number
  isPlaying: boolean
  tours: Tour[]

  // Cinematic controls
  cinematicMode: boolean
  recording: boolean
  showGrid: boolean
  showSafeFrames: boolean
  letterbox: boolean

  // Quality and performance
  quality: "low" | "medium" | "high" | "auto"
  shadows: boolean
  antialiasing: boolean

  // Measurement and tools
  measureMode: boolean
  measurePoints: Array<[number, number, number]>

  // UI state
  helpOpen: boolean
  layerDrawerOpen: boolean
  qualityPanelOpen: boolean
  cinematicPanelOpen: boolean

  // Lighting and environment
  sunPosition: [number, number, number]
  environmentPreset: "dawn" | "day" | "sunset" | "night"

  // Section clipping
  clipping: {
    enabled: boolean
    x: { enabled: boolean; position: number }
    y: { enabled: boolean; position: number }
    z: { enabled: boolean; position: number }
  }

  // Actions
  setExploded: (exploded: boolean) => void
  setAnnotations: (annotations: boolean) => void
  setAboutModalOpen: (open: boolean) => void

  // Layer actions
  setLayer: (layer: keyof AppState["layers"], enabled: boolean) => void
  showAllLayers: () => void
  hideAllLayers: () => void

  // Tour actions
  startTour: (tourId: string) => void
  pauseTour: () => void
  resumeTour: () => void
  stopTour: () => void
  setTourProgress: (progress: number) => void

  // Cinematic actions
  setCinematicMode: (enabled: boolean) => void
  startRecording: () => void
  stopRecording: () => void
  toggleGrid: () => void
  toggleSafeFrames: () => void
  toggleLetterbox: () => void

  // Quality actions
  setQuality: (quality: AppState["quality"]) => void
  setShadows: (enabled: boolean) => void
  setAntialiasing: (enabled: boolean) => void

  // Measurement actions
  setMeasureMode: (enabled: boolean) => void
  addMeasurePoint: (point: [number, number, number]) => void
  clearMeasurePoints: () => void

  // UI actions
  setHelpOpen: (open: boolean) => void
  setLayerDrawerOpen: (open: boolean) => void
  setQualityPanelOpen: (open: boolean) => void
  setCinematicPanelOpen: (open: boolean) => void

  // Environment actions
  setSunPosition: (position: [number, number, number]) => void
  setEnvironmentPreset: (preset: AppState["environmentPreset"]) => void

  // Clipping actions
  setClipping: (axis: "x" | "y" | "z", enabled: boolean, position?: number) => void
  toggleClipping: () => void
}

const defaultTours: Tour[] = [
  {
    id: "overview",
    name: "Plant Overview",
    description: "Complete tour of the Atucha II nuclear facility",
    duration: 120,
    difficulty: "Beginner",
    keyframes: [
      { position: [100, 50, 100], target: [0, 0, 0], duration: 3, description: "Welcome to Atucha II" },
      { position: [50, 30, 80], target: [0, 10, 0], duration: 4, description: "Reactor building overview" },
      { position: [80, 25, 40], target: [40, 0, 20], duration: 4, description: "Turbine hall and generators" },
      { position: [120, 40, 60], target: [60, 0, 30], duration: 3, description: "Electrical switchyard" },
      { position: [0, 60, 120], target: [0, 0, 0], duration: 4, description: "Complete facility view" },
    ],
  },
  {
    id: "reactor",
    name: "Reactor Deep Dive",
    description: "Detailed exploration of the reactor systems",
    duration: 90,
    difficulty: "Advanced",
    keyframes: [
      { position: [30, 20, 30], target: [0, 0, 0], duration: 3, description: "Approaching reactor building" },
      { position: [15, 15, 15], target: [0, 5, 0], duration: 4, description: "Reactor containment structure" },
      { position: [10, 25, 10], target: [0, 10, 0], duration: 4, description: "Steam generator systems" },
      { position: [20, 30, 0], target: [0, 15, 0], duration: 3, description: "Control systems overview" },
    ],
  },
  {
    id: "power",
    name: "Power Generation",
    description: "Follow the energy conversion process",
    duration: 100,
    difficulty: "Intermediate",
    keyframes: [
      { position: [25, 20, 25], target: [0, 0, 0], duration: 3, description: "Nuclear reaction begins" },
      { position: [40, 15, 30], target: [20, 0, 10], duration: 4, description: "Steam generation" },
      { position: [60, 20, 40], target: [40, 0, 20], duration: 4, description: "Turbine rotation" },
      { position: [80, 25, 50], target: [60, 0, 30], duration: 3, description: "Electrical generation" },
      { position: [100, 30, 60], target: [80, 0, 40], duration: 4, description: "Power transmission" },
    ],
  },
  {
    id: "infrastructure",
    name: "Site Infrastructure",
    description: "Supporting systems and facilities",
    duration: 80,
    difficulty: "Beginner",
    keyframes: [
      { position: [150, 60, 100], target: [0, 0, 0], duration: 4, description: "Site overview" },
      { position: [100, 30, 80], target: [60, 0, 40], duration: 3, description: "Switchyard systems" },
      { position: [50, 20, 120], target: [0, 0, 60], duration: 4, description: "Water intake systems" },
      { position: [80, 40, 60], target: [40, 0, 30], duration: 3, description: "Access roads and security" },
    ],
  },
  {
    id: "cinematic",
    name: "Cinematic Experience",
    description: "Dramatic showcase of the facility",
    duration: 150,
    difficulty: "Intermediate",
    keyframes: [
      { position: [200, 100, 150], target: [0, 0, 0], duration: 5, description: "Sunrise approach" },
      { position: [100, 80, 100], target: [0, 20, 0], duration: 6, description: "Majestic overview" },
      { position: [50, 30, 80], target: [0, 10, 0], duration: 5, description: "Close facility inspection" },
      { position: [150, 50, 50], target: [50, 0, 0], duration: 4, description: "Riverside perspective" },
      { position: [0, 120, 200], target: [0, 0, 0], duration: 6, description: "Final aerial view" },
    ],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Basic toggles
      exploded: false,
      annotations: true,
      aboutModalOpen: false,

      // Layer management
      layers: {
        reactor: true,
        turbine: true,
        auxiliary: true,
        switchyard: true,
        water: true,
        terrain: true,
      },

      // Tour system
      currentTour: null,
      tourProgress: 0,
      isPlaying: false,
      tours: defaultTours,

      // Cinematic controls
      cinematicMode: false,
      recording: false,
      showGrid: false,
      showSafeFrames: false,
      letterbox: false,

      // Quality and performance
      quality: "auto",
      shadows: true,
      antialiasing: true,

      // Measurement and tools
      measureMode: false,
      measurePoints: [],

      // UI state
      helpOpen: false,
      layerDrawerOpen: false,
      qualityPanelOpen: false,
      cinematicPanelOpen: false,

      // Lighting and environment
      sunPosition: [100, 100, 50],
      environmentPreset: "day",

      // Section clipping
      clipping: {
        enabled: false,
        x: { enabled: false, position: 0 },
        y: { enabled: false, position: 0 },
        z: { enabled: false, position: 0 },
      },

      // Basic actions
      setExploded: (exploded) => set({ exploded }),
      setAnnotations: (annotations) => set({ annotations }),
      setAboutModalOpen: (aboutModalOpen) => set({ aboutModalOpen }),

      // Layer actions
      setLayer: (layer, enabled) =>
        set((state) => ({
          layers: { ...state.layers, [layer]: enabled },
        })),
      showAllLayers: () =>
        set((state) => ({
          layers: Object.keys(state.layers).reduce(
            (acc, key) => ({
              ...acc,
              [key]: true,
            }),
            {} as AppState["layers"],
          ),
        })),
      hideAllLayers: () =>
        set((state) => ({
          layers: Object.keys(state.layers).reduce(
            (acc, key) => ({
              ...acc,
              [key]: false,
            }),
            {} as AppState["layers"],
          ),
        })),

      // Tour actions
      startTour: (tourId) => set({ currentTour: tourId, tourProgress: 0, isPlaying: true }),
      pauseTour: () => set({ isPlaying: false }),
      resumeTour: () => set({ isPlaying: true }),
      stopTour: () => set({ currentTour: null, tourProgress: 0, isPlaying: false }),
      setTourProgress: (tourProgress) => set({ tourProgress }),

      // Cinematic actions
      setCinematicMode: (cinematicMode) => set({ cinematicMode }),
      startRecording: () => set({ recording: true }),
      stopRecording: () => set({ recording: false }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleSafeFrames: () => set((state) => ({ showSafeFrames: !state.showSafeFrames })),
      toggleLetterbox: () => set((state) => ({ letterbox: !state.letterbox })),

      // Quality actions
      setQuality: (quality) => set({ quality }),
      setShadows: (shadows) => set({ shadows }),
      setAntialiasing: (antialiasing) => set({ antialiasing }),

      // Measurement actions
      setMeasureMode: (measureMode) => set({ measureMode }),
      addMeasurePoint: (point) =>
        set((state) => ({
          measurePoints: [...state.measurePoints, point],
        })),
      clearMeasurePoints: () => set({ measurePoints: [] }),

      // UI actions
      setHelpOpen: (helpOpen) => set({ helpOpen }),
      setLayerDrawerOpen: (layerDrawerOpen) => set({ layerDrawerOpen }),
      setQualityPanelOpen: (qualityPanelOpen) => set({ qualityPanelOpen }),
      setCinematicPanelOpen: (cinematicPanelOpen) => set({ cinematicPanelOpen }),

      // Environment actions
      setSunPosition: (sunPosition) => set({ sunPosition }),
      setEnvironmentPreset: (environmentPreset) => set({ environmentPreset }),

      // Clipping actions
      setClipping: (axis, enabled, position) =>
        set((state) => ({
          clipping: {
            ...state.clipping,
            [axis]: { enabled, position: position ?? state.clipping[axis].position },
          },
        })),
      toggleClipping: () =>
        set((state) => ({
          clipping: { ...state.clipping, enabled: !state.clipping.enabled },
        })),
    }),
    {
      name: "atucha-store",
      partialize: (state) => ({
        layers: state.layers,
        quality: state.quality,
        shadows: state.shadows,
        antialiasing: state.antialiasing,
        environmentPreset: state.environmentPreset,
        sunPosition: state.sunPosition,
      }),
    },
  ),
)
