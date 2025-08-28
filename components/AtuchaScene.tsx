"use client"

import { useRef, useMemo, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useAppStore } from "@/lib/store"
import type * as THREE from "three"

const ReactorBuilding = ({ exploded }: { exploded: boolean }) => {
  const groupRef = useRef<THREE.Group>(null)
  const position = useMemo(() => (exploded ? [0, 5, 0] : [0, 0, 0]), [exploded])

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[15, 15, 30, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 15, 0]} castShadow>
        <sphereGeometry args={[15, 16, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}

const TurbineHall = ({ exploded }: { exploded: boolean }) => {
  const position = useMemo(() => (exploded ? [40, 2, 0] : [30, 0, 0]), [exploded])

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[40, 15, 20]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  )
}

const Terrain = () => (
  <group>
    <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#4a5d23" />
    </mesh>
  </group>
)

export default function AtuchaScene() {
  const { exploded, annotations } = useAppStore()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  const updateLight = useCallback((state: any) => {
    try {
      if (lightRef.current) {
        const time = state.clock.elapsedTime * 0.1
        lightRef.current.position.set(Math.cos(time) * 50, 30, Math.sin(time) * 50)
      }
    } catch (error) {
      console.error("[v0] Light update error:", error)
    }
  }, [])

  useFrame(updateLight)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      <Environment preset="city" />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
      />

      <Terrain />
      <ReactorBuilding exploded={exploded} />
      <TurbineHall exploded={exploded} />

      {annotations && (
        <group>
          <mesh position={[0, 35, 0]}>
            <sphereGeometry args={[0.5]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
        </group>
      )}
    </>
  )
}
