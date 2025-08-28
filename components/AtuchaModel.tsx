"use client"

import { useRef, useMemo } from "react"
import { useControls } from "leva"
import * as THREE from "three"

interface ReactorBuildingProps {
  exploded?: boolean
}

export function ReactorBuilding({ exploded = false }: ReactorBuildingProps) {
  const meshRef = useRef<THREE.Group>(null)

  const { reactorDiameter, reactorHeight, domeHeight, ribCount, ringCount } = useControls("Reactor Building", {
    reactorDiameter: { value: 24, min: 15, max: 40, step: 1 },
    reactorHeight: { value: 30, min: 20, max: 50, step: 1 },
    domeHeight: { value: 12, min: 8, max: 20, step: 1 },
    ribCount: { value: 16, min: 8, max: 32, step: 1 },
    ringCount: { value: 6, min: 3, max: 12, step: 1 },
  })

  const explodeOffset = exploded ? [0, 10, 0] : [0, 0, 0]

  // Generate vertical ribs
  const ribs = useMemo(() => {
    const ribGeometry = new THREE.BoxGeometry(0.5, reactorHeight, 0.8)
    const ribs = []

    for (let i = 0; i < ribCount; i++) {
      const angle = (i / ribCount) * Math.PI * 2
      const x = Math.cos(angle) * (reactorDiameter / 2 + 0.3)
      const z = Math.sin(angle) * (reactorDiameter / 2 + 0.3)
      ribs.push({ position: [x, reactorHeight / 2, z], rotation: [0, angle, 0] })
    }
    return ribs
  }, [reactorDiameter, reactorHeight, ribCount])

  // Generate ring seams
  const rings = useMemo(() => {
    const rings = []
    for (let i = 1; i < ringCount; i++) {
      const y = (i / ringCount) * reactorHeight
      rings.push({ position: [0, y, 0], scale: [reactorDiameter + 0.5, 0.3, reactorDiameter + 0.5] })
    }
    return rings
  }, [reactorDiameter, reactorHeight, ringCount])

  return (
    <group ref={meshRef} position={explodeOffset}>
      {/* Main cylindrical containment */}
      <mesh position={[0, reactorHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[reactorDiameter / 2, reactorDiameter / 2, reactorHeight, 32]} />
        <meshStandardMaterial color="#8B8680" roughness={0.9} metalness={0} />
      </mesh>

      {/* Hemispherical dome */}
      <mesh position={[0, reactorHeight + domeHeight / 2, 0]} castShadow>
        <sphereGeometry args={[reactorDiameter / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B8680" roughness={0.9} metalness={0} />
      </mesh>

      {/* Vertical ribs */}
      {ribs.map((rib, index) => (
        <mesh
          key={`rib-${index}`}
          position={rib.position as [number, number, number]}
          rotation={rib.rotation as [number, number, number]}
          castShadow
        >
          <boxGeometry args={[0.5, reactorHeight, 0.8]} />
          <meshStandardMaterial color="#7A7470" roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* Ring seams */}
      {rings.map((ring, index) => (
        <mesh
          key={`ring-${index}`}
          position={ring.position as [number, number, number]}
          scale={ring.scale as [number, number, number]}
          castShadow
        >
          <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
          <meshStandardMaterial color="#7A7470" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

interface TurbineHallProps {
  exploded?: boolean
}

export function TurbineHall({ exploded = false }: TurbineHallProps) {
  const { hallLength, hallWidth, hallHeight, skylightCount, roofPitch } = useControls("Turbine Hall", {
    hallLength: { value: 80, min: 50, max: 120, step: 5 },
    hallWidth: { value: 25, min: 15, max: 40, step: 1 },
    hallHeight: { value: 18, min: 12, max: 30, step: 1 },
    skylightCount: { value: 8, min: 4, max: 16, step: 1 },
    roofPitch: { value: 0.1, min: 0, max: 0.3, step: 0.05 },
  })

  const explodeOffset = exploded ? [15, 5, 0] : [0, 0, 0]

  // Generate skylight strips
  const skylights = useMemo(() => {
    const skylights = []
    for (let i = 0; i < skylightCount; i++) {
      const x = (i / (skylightCount - 1) - 0.5) * (hallLength - 5)
      skylights.push({ position: [x, hallHeight + roofPitch * 2, 0] })
    }
    return skylights
  }, [hallLength, hallHeight, skylightCount, roofPitch])

  return (
    <group position={[50, ...explodeOffset]}>
      {/* Main hall structure */}
      <mesh position={[0, hallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[hallLength, hallHeight, hallWidth]} />
        <meshStandardMaterial color="#B0B8C1" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gabled roof */}
      <mesh position={[0, hallHeight + (roofPitch * hallWidth) / 2, 0]} castShadow>
        <boxGeometry args={[hallLength, roofPitch * hallWidth, hallWidth * 1.1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Skylight strips */}
      {skylights.map((skylight, index) => (
        <mesh key={`skylight-${index}`} position={skylight.position as [number, number, number]} castShadow>
          <boxGeometry args={[3, 0.5, hallWidth * 1.2]} />
          <meshPhysicalMaterial color="#E5E7EB" roughness={0.1} transmission={0.8} transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Side ventilation grilles */}
      <mesh position={[0, hallHeight * 0.8, hallWidth / 2 + 0.1]} castShadow>
        <boxGeometry args={[hallLength * 0.8, 2, 0.2]} />
        <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh position={[0, hallHeight * 0.8, -hallWidth / 2 - 0.1]} castShadow>
        <boxGeometry args={[hallLength * 0.8, 2, 0.2]} />
        <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  )
}

interface AuxiliaryBlocksProps {
  exploded?: boolean
}

export function AuxiliaryBlocks({ exploded = false }: AuxiliaryBlocksProps) {
  const { blockCount, blockSpread, minHeight, maxHeight } = useControls("Auxiliary Blocks", {
    blockCount: { value: 6, min: 3, max: 12, step: 1 },
    blockSpread: { value: 40, min: 20, max: 80, step: 5 },
    minHeight: { value: 8, min: 4, max: 12, step: 1 },
    maxHeight: { value: 20, min: 12, max: 30, step: 1 },
  })

  const explodeOffset = exploded ? [0, 0, 15] : [0, 0, 0]

  // Generate auxiliary building blocks
  const blocks = useMemo(() => {
    const blocks = []
    for (let i = 0; i < blockCount; i++) {
      const angle = (i / blockCount) * Math.PI * 2
      const distance = 25 + Math.random() * blockSpread
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const width = 8 + Math.random() * 12
      const depth = 6 + Math.random() * 10
      const height = minHeight + Math.random() * (maxHeight - minHeight)

      blocks.push({
        position: [x, height / 2, z],
        scale: [width, height, depth],
        rotation: [0, (Math.random() * Math.PI) / 4, 0],
      })
    }
    return blocks
  }, [blockCount, blockSpread, minHeight, maxHeight])

  return (
    <group position={explodeOffset}>
      {blocks.map((block, index) => (
        <group key={`aux-block-${index}`}>
          {/* Main building block */}
          <mesh
            position={block.position as [number, number, number]}
            scale={block.scale as [number, number, number]}
            rotation={block.rotation as [number, number, number]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#A1A1AA" roughness={0.7} metalness={0.3} />
          </mesh>

          {/* Decorative ladder */}
          <mesh position={[block.position[0] + block.scale[0] / 2, block.position[1], block.position[2]]} castShadow>
            <boxGeometry args={[0.3, block.scale[1], 0.8]} />
            <meshStandardMaterial color="#4B5563" roughness={0.8} metalness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
