"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Stats, Html } from "@react-three/drei"
import { useAppStore } from "@/lib/store"
import * as THREE from "three"
import { AtuchaModel } from "./AtuchaModel"

const PerformanceMonitor = () => {
  const { setFps } = useAppStore()
  const { gl } = useThree()

  useFrame((state) => {
    const fps = Math.round(1 / state.clock.getDelta())
    setFps(fps)
  })

  return null
}

const LightingSystem = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const { shadows } = useAppStore()

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime * 0.05
      lightRef.current.position.set(Math.cos(time) * 80, 50 + Math.sin(time * 0.5) * 20, Math.sin(time) * 80)
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        intensity={1.2}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
      <hemisphereLight intensity={0.4} groundColor="#444444" />
    </>
  )
}

const Terrain = () => {
  const terrainRef = useRef<THREE.Mesh>(null)

  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(300, 300, 64, 64)
    const vertices = geometry.attributes.position.array as Float32Array

    // Add subtle height variation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const z = vertices[i + 2]
      vertices[i + 1] = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 2
    }

    geometry.computeVertexNormals()
    return geometry
  }, [])

  return (
    <mesh
      ref={terrainRef}
      geometry={terrainGeometry}
      receiveShadow
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial color="#2d5016" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

const AnnotationSystem = () => {
  const { annotations } = useAppStore()

  if (!annotations) return null

  return (
    <group>
      <Html position={[0, 40, 0]} center>
        <div className="bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium">Reactor Building</div>
      </Html>
      <Html position={[30, 20, 0]} center>
        <div className="bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium">Turbine Hall</div>
      </Html>
    </group>
  )
}

export default function AtuchaScene() {
  const { exploded, annotations, quality, wireframe, shadows, autoRotate, cameraPosition } = useAppStore()

  const controlsRef = useRef<any>(null)

  const qualitySettings = useMemo(() => {
    switch (quality) {
      case "low":
        return { shadowMapSize: 512, segments: 8, detail: 0.5 }
      case "medium":
        return { shadowMapSize: 1024, segments: 16, detail: 0.75 }
      case "high":
        return { shadowMapSize: 2048, segments: 32, detail: 1.0 }
      case "ultra":
        return { shadowMapSize: 4096, segments: 64, detail: 1.5 }
      default:
        return { shadowMapSize: 2048, segments: 32, detail: 1.0 }
    }
  }, [quality])

  return (
    <>
      <PerformanceMonitor />
      <LightingSystem />

      <Environment preset="city" background={false} environmentIntensity={0.6} />

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={30}
        maxDistance={200}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
      />

      <Terrain />
      <AtuchaModel exploded={exploded} wireframe={wireframe} quality={qualitySettings} />
      <AnnotationSystem />

      {quality === "ultra" && <Stats />}
    </>
  )
}
