"use client"

import { useRef, useEffect, useMemo, useCallback } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { useAppStore } from "@/lib/store"
import { ReactorBuilding, TurbineHall, AuxiliaryBlocks } from "./AtuchaModel"
import { Switchyard } from "./Switchyard"
import { WaterAndTerrain } from "./WaterAndTerrain"
import { TOURS, getTourAtProgress } from "@/lib/tours"
import type * as THREE from "three"

interface AtuchaSceneProps {
  tourId?: string | null
}

export default function AtuchaScene({ tourId }: AtuchaSceneProps) {
  const { camera } = useThree()
  const { layers, sunPosition, environmentPreset, quality, exploded, tourProgress, setTourProgress } = useAppStore()

  const lightRef = useRef<THREE.DirectionalLight>(null)
  const controlsRef = useRef<any>(null)
  const tourStartTimeRef = useRef<number>(0)
  const isInTourRef = useRef<boolean>(false)
  const lastUpdateTimeRef = useRef<number>(0)

  const currentTour = useMemo(() => (tourId ? TOURS.find((t) => t.id === tourId) : null), [tourId])

  const shadowMapSize = useMemo(() => {
    switch (quality) {
      case "high":
        return 2048
      case "medium":
        return 1024
      case "low":
        return 512
      default:
        return 1024
    }
  }, [quality])

  const handleTourUpdate = useCallback(
    (progress: number) => {
      if (currentTour) {
        const tourState = getTourAtProgress(currentTour, progress)
        camera.position.lerp(tourState.position, 0.03)
        camera.lookAt(tourState.target)
        camera.updateMatrixWorld()
      }
    },
    [currentTour, camera],
  )

  useEffect(() => {
    if (tourId && currentTour) {
      isInTourRef.current = true
      tourStartTimeRef.current = Date.now()
      setTourProgress(0)

      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }
    } else {
      isInTourRef.current = false

      if (controlsRef.current) {
        controlsRef.current.enabled = true
      }
    }

    return () => {
      isInTourRef.current = false
    }
  }, [tourId, currentTour, setTourProgress])

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime
    if (now - lastUpdateTimeRef.current < 1 / 60) return
    lastUpdateTimeRef.current = now

    if (lightRef.current) {
      const angle = sunPosition * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(angle) * 100
      const y = Math.sin(angle) * 50 + 20
      lightRef.current.position.set(x, y, 0)
    }

    if (isInTourRef.current && currentTour) {
      const elapsed = (Date.now() - tourStartTimeRef.current) / 1000
      const progress = Math.min(elapsed / currentTour.totalDuration, 1)

      if (Math.abs(progress - tourProgress) > 0.005) {
        setTourProgress(progress)
        handleTourUpdate(progress)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        intensity={1.2}
        castShadow={quality !== "low"}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />

      <Environment preset={environmentPreset} />

      {!tourId && (
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      )}

      {layers.terrain && <WaterAndTerrain exploded={exploded} />}
      {layers.reactor && <ReactorBuilding exploded={exploded} />}
      {layers.turbineHall && <TurbineHall exploded={exploded} />}
      {layers.auxiliary && <AuxiliaryBlocks exploded={exploded} />}
      {layers.switchyard && <Switchyard exploded={exploded} />}

      {quality !== "low" && (
        <ContactShadows position={[0, -0.9, 0]} opacity={0.4} scale={100} blur={quality === "high" ? 2 : 1} far={50} />
      )}
    </>
  )
}
