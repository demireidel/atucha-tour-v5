"use client"

import { useRef, useMemo } from "react"
import * as THREE from "three"

interface ReactorBuildingProps {
  exploded?: boolean
}

export function ReactorBuilding({ exploded = false }: ReactorBuildingProps) {
  const meshRef = useRef<THREE.Group>(null)

  const reactorDiameter = 24
  const reactorHeight = 30
  const domeHeight = 12
  const ribCount = 32 // Increased for maximum detail
  const ringCount = 12 // Increased for maximum detail

  const explodeOffset = exploded ? [0, 10, 0] : [0, 0, 0]

  const ribs = useMemo(() => {
    const ribs = []
    for (let i = 0; i < ribCount; i++) {
      const angle = (i / ribCount) * Math.PI * 2
      const x = Math.cos(angle) * (reactorDiameter / 2 + 0.3)
      const z = Math.sin(angle) * (reactorDiameter / 2 + 0.3)
      ribs.push({ position: [x, reactorHeight / 2, z], rotation: [0, angle, 0] })
    }
    return ribs
  }, [])

  const rings = useMemo(() => {
    const rings = []
    for (let i = 1; i < ringCount; i++) {
      const y = (i / ringCount) * reactorHeight
      rings.push({ position: [0, y, 0], scale: [reactorDiameter + 0.5, 0.3, reactorDiameter + 0.5] })
    }
    return rings
  }, [])

  const accessHatches = useMemo(() => {
    const hatches = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x = Math.cos(angle) * (reactorDiameter / 2 - 1)
      const z = Math.sin(angle) * (reactorDiameter / 2 - 1)
      hatches.push({ position: [x, 5, z], rotation: [0, angle, 0] })
    }
    return hatches
  }, [])

  const pipingSystems = useMemo(() => {
    const pipes = []
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const x = Math.cos(angle) * (reactorDiameter / 2 + 3)
      const z = Math.sin(angle) * (reactorDiameter / 2 + 3)
      pipes.push({
        position: [x, reactorHeight * 0.6, z],
        rotation: [0, angle + Math.PI / 2, 0],
        scale: [8, 1.2, 1.2],
      })
    }
    return pipes
  }, [])

  return (
    <group ref={meshRef} position={explodeOffset}>
      {/* Main cylindrical containment with enhanced detail */}
      <mesh position={[0, reactorHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[reactorDiameter / 2, reactorDiameter / 2, reactorHeight, 64]} />
        <meshStandardMaterial
          color="#8B8680"
          roughness={0.9}
          metalness={0.1}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>

      {/* Enhanced hemispherical dome */}
      <mesh position={[0, reactorHeight + domeHeight / 2, 0]} castShadow>
        <sphereGeometry args={[reactorDiameter / 2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#8B8680"
          roughness={0.9}
          metalness={0.1}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
      </mesh>

      {/* Enhanced vertical ribs */}
      {ribs.map((rib, index) => (
        <mesh
          key={`rib-${index}`}
          position={rib.position as [number, number, number]}
          rotation={rib.rotation as [number, number, number]}
          castShadow
        >
          <boxGeometry args={[0.6, reactorHeight, 1.0]} />
          <meshStandardMaterial color="#7A7470" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Enhanced ring seams */}
      {rings.map((ring, index) => (
        <mesh
          key={`ring-${index}`}
          position={ring.position as [number, number, number]}
          scale={ring.scale as [number, number, number]}
          castShadow
        >
          <cylinderGeometry args={[0.5, 0.5, 0.4, 64]} />
          <meshStandardMaterial color="#7A7470" roughness={0.8} metalness={0.3} />
        </mesh>
      ))}

      {accessHatches.map((hatch, index) => (
        <group key={`hatch-${index}`}>
          <mesh
            position={hatch.position as [number, number, number]}
            rotation={hatch.rotation as [number, number, number]}
            castShadow
          >
            <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
            <meshStandardMaterial color="#5A5A5A" roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Hatch wheel */}
          <mesh
            position={[hatch.position[0], hatch.position[1] + 0.2, hatch.position[2]]}
            rotation={hatch.rotation as [number, number, number]}
            castShadow
          >
            <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
            <meshStandardMaterial color="#4A4A4A" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {pipingSystems.map((pipe, index) => (
        <group key={`pipe-${index}`}>
          <mesh
            position={pipe.position as [number, number, number]}
            rotation={pipe.rotation as [number, number, number]}
            scale={pipe.scale as [number, number, number]}
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
            <meshStandardMaterial color="#6B7280" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Pipe supports */}
          <mesh position={[pipe.position[0], pipe.position[1] - 2, pipe.position[2]]} castShadow>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#4B5563" roughness={0.7} metalness={0.6} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[reactorDiameter / 2 + 2, reactorDiameter / 2 + 2, 4, 64]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.9} metalness={0} />
      </mesh>

      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        const x = Math.cos(angle) * (reactorDiameter / 2 + 1.5)
        const z = Math.sin(angle) * (reactorDiameter / 2 + 1.5)
        return (
          <mesh key={`vent-${i}`} position={[x, reactorHeight * 0.8, z]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[2, 3, 0.5]} />
            <meshStandardMaterial color="#5A5A5A" roughness={0.6} metalness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

interface TurbineHallProps {
  exploded?: boolean
}

export function TurbineHall({ exploded = false }: TurbineHallProps) {
  const hallLength = 80
  const hallWidth = 25
  const hallHeight = 18
  const skylightCount = 16 // Increased for maximum detail
  const roofPitch = 0.1

  const explodeOffset = exploded ? [15, 5, 0] : [0, 0, 0]

  const skylights = useMemo(() => {
    const skylights = []
    for (let i = 0; i < skylightCount; i++) {
      const x = (i / (skylightCount - 1) - 0.5) * (hallLength - 5)
      skylights.push({ position: [x, hallHeight + roofPitch * 2, 0] })
    }
    return skylights
  }, [])

  const turbineUnits = useMemo(() => {
    const units = []
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 25
      units.push({ position: [x, hallHeight / 2, 0] })
    }
    return units
  }, [])

  const craneSystem = useMemo(() => {
    return {
      rails: [
        { position: [0, hallHeight - 2, hallWidth / 2 - 1], scale: [hallLength, 0.5, 0.5] },
        { position: [0, hallHeight - 2, -hallWidth / 2 + 1], scale: [hallLength, 0.5, 0.5] },
      ],
      bridge: { position: [10, hallHeight - 1, 0], scale: [4, 1, hallWidth - 2] },
    }
  }, [])

  return (
    <group position={[50, ...explodeOffset]}>
      {/* Enhanced main hall structure */}
      <mesh position={[0, hallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[hallLength, hallHeight, hallWidth]} />
        <meshStandardMaterial
          color="#B0B8C1"
          roughness={0.3}
          metalness={0.8}
          normalScale={new THREE.Vector2(0.2, 0.2)}
        />
      </mesh>

      {/* Enhanced gabled roof */}
      <mesh position={[0, hallHeight + (roofPitch * hallWidth) / 2, 0]} castShadow>
        <boxGeometry args={[hallLength, roofPitch * hallWidth, hallWidth * 1.1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Enhanced skylight strips */}
      {skylights.map((skylight, index) => (
        <mesh key={`skylight-${index}`} position={skylight.position as [number, number, number]} castShadow>
          <boxGeometry args={[2, 0.5, hallWidth * 1.2]} />
          <meshPhysicalMaterial
            color="#E5E7EB"
            roughness={0.1}
            transmission={0.8}
            transparent
            opacity={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}

      {turbineUnits.map((unit, index) => (
        <group key={`turbine-${index}`}>
          {/* Main turbine casing */}
          <mesh position={unit.position as [number, number, number]} castShadow>
            <cylinderGeometry args={[3, 3, 8, 32]} />
            <meshStandardMaterial color="#4B5563" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Generator */}
          <mesh position={[unit.position[0], unit.position[1], unit.position[2] + 6]} castShadow>
            <cylinderGeometry args={[2.5, 2.5, 6, 32]} />
            <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Control panel */}
          <mesh position={[unit.position[0] + 4, unit.position[1] - 2, unit.position[2]]} castShadow>
            <boxGeometry args={[1, 3, 2]} />
            <meshStandardMaterial color="#1F2937" roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {craneSystem.rails.map((rail, index) => (
        <mesh
          key={`rail-${index}`}
          position={rail.position as [number, number, number]}
          scale={rail.scale as [number, number, number]}
          castShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.8} />
        </mesh>
      ))}

      <mesh
        position={craneSystem.bridge.position as [number, number, number]}
        scale={craneSystem.bridge.scale as [number, number, number]}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4B5563" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Enhanced side ventilation grilles */}
      <mesh position={[0, hallHeight * 0.8, hallWidth / 2 + 0.1]} castShadow>
        <boxGeometry args={[hallLength * 0.8, 3, 0.3]} />
        <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh position={[0, hallHeight * 0.8, -hallWidth / 2 - 0.1]} castShadow>
        <boxGeometry args={[hallLength * 0.8, 3, 0.3]} />
        <meshStandardMaterial color="#6B7280" roughness={0.6} metalness={0.5} />
      </mesh>

      {[-1, 1].map((side, index) => (
        <mesh
          key={`door-${index}`}
          position={[hallLength / 2 - 2, hallHeight / 3, side * (hallWidth / 2 + 0.2)]}
          castShadow
        >
          <boxGeometry args={[4, hallHeight / 2, 0.5]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

interface AuxiliaryBlocksProps {
  exploded?: boolean
}

export function AuxiliaryBlocks({ exploded = false }: AuxiliaryBlocksProps) {
  const blockCount = 12 // Increased for maximum detail
  const blockSpread = 40
  const minHeight = 8
  const maxHeight = 20

  const explodeOffset = exploded ? [0, 0, 15] : [0, 0, 0]

  const blocks = useMemo(() => {
    const blocks = []
    const seed = 12345 // Fixed seed for consistent generation
    let random = seed

    for (let i = 0; i < blockCount; i++) {
      // Simple seeded random function
      random = (random * 9301 + 49297) % 233280
      const rand1 = random / 233280
      random = (random * 9301 + 49297) % 233280
      const rand2 = random / 233280
      random = (random * 9301 + 49297) % 233280
      const rand3 = random / 233280
      random = (random * 9301 + 49297) % 233280
      const rand4 = random / 233280
      random = (random * 9301 + 49297) % 233280
      const rand5 = random / 233280
      random = (random * 9301 + 49297) % 233280
      const rand6 = random / 233280

      const angle = (i / blockCount) * Math.PI * 2
      const distance = 25 + rand1 * blockSpread
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const width = 8 + rand2 * 12
      const depth = 6 + rand3 * 10
      const height = minHeight + rand4 * (maxHeight - minHeight)

      blocks.push({
        position: [x, height / 2, z],
        scale: [width, height, depth],
        rotation: [0, (rand5 * Math.PI) / 4, 0],
        type: Math.floor(rand6 * 3), // 0: office, 1: technical, 2: storage
      })
    }
    return blocks
  }, [])

  return (
    <group position={explodeOffset}>
      {blocks.map((block, index) => (
        <group key={`aux-block-${index}`}>
          {/* Enhanced main building block */}
          <mesh
            position={block.position as [number, number, number]}
            scale={block.scale as [number, number, number]}
            rotation={block.rotation as [number, number, number]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={block.type === 0 ? "#A1A1AA" : block.type === 1 ? "#9CA3AF" : "#8B8680"}
              roughness={0.7}
              metalness={0.3}
              normalScale={new THREE.Vector2(0.3, 0.3)}
            />
          </mesh>

          {/* Enhanced decorative elements */}
          <mesh position={[block.position[0] + block.scale[0] / 2, block.position[1], block.position[2]]} castShadow>
            <boxGeometry args={[0.4, block.scale[1], 1.0]} />
            <meshStandardMaterial color="#4B5563" roughness={0.8} metalness={0.6} />
          </mesh>

          <mesh
            position={[block.position[0], block.position[1] + block.scale[1] / 2 + 0.5, block.position[2]]}
            castShadow
          >
            <boxGeometry args={[2, 1, 1.5]} />
            <meshStandardMaterial color="#6B7280" roughness={0.5} metalness={0.7} />
          </mesh>

          {block.type === 0 && (
            <>
              {[0.3, -0.3].map((yOffset, yIndex) => (
                <mesh
                  key={`window-${yIndex}`}
                  position={[
                    block.position[0] + block.scale[0] / 2 + 0.01,
                    block.position[1] + yOffset * block.scale[1],
                    block.position[2],
                  ]}
                  castShadow
                >
                  <boxGeometry args={[0.05, block.scale[1] * 0.4, block.scale[2] * 0.8]} />
                  <meshPhysicalMaterial color="#E5E7EB" roughness={0.1} transmission={0.9} transparent opacity={0.2} />
                </mesh>
              ))}
            </>
          )}

          {block.type === 1 && (
            <>
              {[0, 1, 2].map((i) => (
                <mesh
                  key={`equipment-${i}`}
                  position={[
                    block.position[0] + (i - 1) * 2,
                    block.position[1] + block.scale[1] / 2 + 1,
                    block.position[2],
                  ]}
                  castShadow
                >
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.8} />
                </mesh>
              ))}
            </>
          )}
        </group>
      ))}
    </group>
  )
}
