"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import AtuchaScene from "@/components/AtuchaScene"
import UiOverlay from "@/components/UiOverlay"

function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading Atucha II...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="relative h-screen w-full">
      <div className="canvas-container">
        <Canvas
          camera={{ position: [50, 30, 50], fov: 50 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        >
          <Suspense fallback={null}>
            <AtuchaScene />
          </Suspense>
        </Canvas>
      </div>

      <Suspense fallback={<Loading />}>
        <UiOverlay />
      </Suspense>
    </main>
  )
}
