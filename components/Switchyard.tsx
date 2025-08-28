"use client"

import { useMemo } from "react"
import * as THREE from "three"

interface SwitchyardProps {
  exploded?: boolean
}

export function Switchyard({ exploded = false }: SwitchyardProps) {
  const yardWidth = 80
  const yardDepth = 60
  const transformerCount = 12
  const pylonCount = 16
  const fenceHeight = 4
  const busbarCount = 6
  const switchCount = 24
  const lightningRodCount = 8

  const explodeOffset = exploded ? [0, 0, -20] : [0, 0, 0]

  const transformers = useMemo(() => {
    const transformers = []
    const rows = Math.ceil(Math.sqrt(transformerCount))
    const cols = Math.ceil(transformerCount / rows)

    for (let i = 0; i < transformerCount; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = (col / (cols - 1) - 0.5) * (yardWidth - 15)
      const z = (row / (rows - 1) - 0.5) * (yardDepth - 15)

      transformers.push({
        position: [x, 3, z],
        scale: [4, 6, 3],
        rotation: [0, (i * Math.PI) / 4, 0],
        type: i % 3, // Different transformer types
      })
    }
    return transformers
  }, [])

  const pylons = useMemo(() => {
    const pylons = []
    for (let i = 0; i < pylonCount; i++) {
      const angle = (i / pylonCount) * Math.PI * 2
      const distance = Math.min(yardWidth, yardDepth) / 2 - 8
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance

      pylons.push({
        position: [x, 10, z],
        height: 16 + (i % 3) * 2,
        type: i % 2, // Different pylon types
      })
    }
    return pylons
  }, [])

  const busbars = useMemo(() => {
    const busbars = []
    for (let i = 0; i < busbarCount; i++) {
      const x = (i / (busbarCount - 1) - 0.5) * (yardWidth - 10)
      busbars.push({
        position: [x, 12, 0],
        length: yardDepth - 20,
      })
    }
    return busbars
  }, [])

  const switches = useMemo(() => {
    const switches = []
    for (let i = 0; i < switchCount; i++) {
      const row = Math.floor(i / 6)
      const col = i % 6
      const x = (col / 5 - 0.5) * (yardWidth - 20)
      const z = (row / 3 - 0.5) * (yardDepth - 30)

      switches.push({
        position: [x, 1.5, z],
        rotation: [0, (i * Math.PI) / 6, 0],
      })
    }
    return switches
  }, [])

  const lightningRods = useMemo(() => {
    const rods = []
    for (let i = 0; i < lightningRodCount; i++) {
      const angle = (i / lightningRodCount) * Math.PI * 2
      const distance = Math.min(yardWidth, yardDepth) / 2 - 3
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance

      rods.push({
        position: [x, 20, z],
      })
    }
    return rods
  }, [])

  const fenceSections = useMemo(() => {
    const sections = []
    const perimeter = [
      { start: [-yardWidth / 2, 0, -yardDepth / 2], end: [yardWidth / 2, 0, -yardDepth / 2] },
      { start: [yardWidth / 2, 0, -yardDepth / 2], end: [yardWidth / 2, 0, yardDepth / 2] },
      { start: [yardWidth / 2, 0, yardDepth / 2], end: [-yardWidth / 2, 0, yardDepth / 2] },
      { start: [-yardWidth / 2, 0, yardDepth / 2], end: [-yardWidth / 2, 0, -yardDepth / 2] },
    ]

    perimeter.forEach((section, index) => {
      const startVec = new THREE.Vector3(section.start[0], section.start[1], section.start[2])
      const endVec = new THREE.Vector3(section.end[0], section.end[1], section.end[2])

      const length = startVec.distanceTo(endVec)
      const centerX = (section.start[0] + section.end[0]) * 0.5
      const centerY = (section.start[1] + section.end[1]) * 0.5
      const centerZ = (section.start[2] + section.end[2]) * 0.5

      const angle = Math.atan2(section.end[2] - section.start[2], section.end[0] - section.start[0])

      sections.push({
        position: [centerX, fenceHeight / 2, centerZ],
        scale: [length, fenceHeight, 0.2],
        rotation: [0, angle, 0],
      })
    })

    return sections
  }, [])

  return (
    <group position={[-80, ...explodeOffset]}>
      {/* Enhanced ground pad with grid pattern */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[yardWidth, 0.2, yardDepth]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Grid lines for organization */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`grid-x-${i}`} position={[(i / 8 - 0.5) * yardWidth, 0.01, 0]} receiveShadow>
          <boxGeometry args={[0.1, 0.02, yardDepth]} />
          <meshStandardMaterial color="#4B5563" roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`grid-z-${i}`} position={[0, 0.01, (i / 6 - 0.5) * yardDepth]} receiveShadow>
          <boxGeometry args={[yardWidth, 0.02, 0.1]} />
          <meshStandardMaterial color="#4B5563" roughness={0.9} />
        </mesh>
      ))}

      {/* Enhanced transformers with detailed components */}
      {transformers.map((transformer, index) => (
        <group key={`transformer-${index}`}>
          {/* Main transformer body */}
          <mesh
            position={transformer.position as [number, number, number]}
            scale={transformer.scale as [number, number, number]}
            rotation={transformer.rotation as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={transformer.type === 0 ? "#1F2937" : transformer.type === 1 ? "#374151" : "#4B5563"}
              roughness={0.6}
              metalness={0.8}
            />
          </mesh>

          {/* Cooling fins */}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh
              key={`fin-${i}`}
              position={[
                transformer.position[0] + transformer.scale[0] / 2 + 0.1,
                transformer.position[1] + (i / 5 - 0.5) * transformer.scale[1] * 0.8,
                transformer.position[2],
              ]}
              castShadow
            >
              <boxGeometry args={[0.2, transformer.scale[1] * 0.15, transformer.scale[2] * 0.9]} />
              <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.9} />
            </mesh>
          ))}

          {/* Bushings */}
          <mesh
            position={[
              transformer.position[0],
              transformer.position[1] + transformer.scale[1] / 2 + 0.5,
              transformer.position[2],
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
            <meshStandardMaterial color="#8B5CF6" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Enhanced pylons with detailed lattice structure */}
      {pylons.map((pylon, index) => (
        <group key={`pylon-${index}`}>
          {/* Main pole */}
          <mesh position={[pylon.position[0], pylon.height / 2, pylon.position[2]]} castShadow>
            <cylinderGeometry args={[0.4, 0.6, pylon.height, 8]} />
            <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.9} />
          </mesh>

          {/* Multiple cross arms at different heights */}
          {[0.9, 0.7, 0.5].map((heightRatio, armIndex) => (
            <mesh
              key={`arm-${armIndex}`}
              position={[pylon.position[0], pylon.height * heightRatio, pylon.position[2]]}
              castShadow
            >
              <boxGeometry args={[6 - armIndex, 0.4, 0.4]} />
              <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.9} />
            </mesh>
          ))}

          {/* Insulators */}
          {[-2, 0, 2].map((offset, insIndex) => (
            <mesh
              key={`insulator-${insIndex}`}
              position={[pylon.position[0] + offset, pylon.height * 0.9 - 0.5, pylon.position[2]]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
              <meshStandardMaterial color="#F3F4F6" roughness={0.2} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Busbar system */}
      {busbars.map((busbar, index) => (
        <group key={`busbar-${index}`}>
          {/* Main busbar conductor */}
          <mesh position={[busbar.position[0], busbar.position[1], busbar.position[2]]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, busbar.length, 16]} />
            <meshStandardMaterial color="#FCD34D" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Support insulators */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={`support-${i}`}
              position={[
                busbar.position[0],
                busbar.position[1] - 1,
                busbar.position[2] + (i / 4 - 0.5) * busbar.length * 0.8,
              ]}
              castShadow
            >
              <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
              <meshStandardMaterial color="#F3F4F6" roughness={0.3} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Switch gear */}
      {switches.map((switchGear, index) => (
        <group key={`switch-${index}`}>
          <mesh
            position={switchGear.position as [number, number, number]}
            rotation={switchGear.rotation as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[1.5, 3, 0.8]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* Control panel */}
          <mesh position={[switchGear.position[0] + 0.8, switchGear.position[1], switchGear.position[2]]} castShadow>
            <boxGeometry args={[0.3, 2, 0.6]} />
            <meshStandardMaterial color="#1F2937" roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Lightning protection system */}
      {lightningRods.map((rod, index) => (
        <group key={`lightning-${index}`}>
          {/* Lightning rod */}
          <mesh position={[rod.position[0], rod.position[1], rod.position[2]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
            <meshStandardMaterial color="#9CA3AF" roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Support mast */}
          <mesh position={[rod.position[0], rod.position[1] - 2, rod.position[2]]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Enhanced fence with posts */}
      {fenceSections.map((section, index) => (
        <group key={`fence-section-${index}`}>
          <mesh
            position={section.position as [number, number, number]}
            scale={section.scale as [number, number, number]}
            rotation={section.rotation as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9CA3AF" roughness={0.8} metalness={0.3} transparent opacity={0.7} />
          </mesh>

          {/* Fence posts */}
          {Array.from({ length: Math.floor(section.scale[0] / 5) + 1 }, (_, i) => (
            <mesh
              key={`post-${i}`}
              position={[
                section.position[0] + (i / Math.floor(section.scale[0] / 5) - 0.5) * section.scale[0],
                section.position[1],
                section.position[2],
              ]}
              castShadow
            >
              <cylinderGeometry args={[0.1, 0.1, fenceHeight, 8]} />
              <meshStandardMaterial color="#6B7280" roughness={0.8} metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Control building */}
      <mesh position={[yardWidth / 2 - 5, 3, yardDepth / 2 - 5]} castShadow receiveShadow>
        <boxGeometry args={[8, 6, 6]} />
        <meshStandardMaterial color="#A1A1AA" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}
