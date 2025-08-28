"use client"

import { useRef, useMemo } from "react"
import type * as THREE from "three"

interface ReactorBuildingProps {
  exploded?: boolean
}

export function ReactorBuilding({ exploded = false }: ReactorBuildingProps) {
  const meshRef = useRef<THREE.Group>(null)

  const reactorDiameter = 24
  const reactorHeight = 30
  const domeHeight = 12
  const ribCount = 16
  const ringCount = 6

  const explodeOffset = exploded ? [0, 10, 0] : [0, 0, 0]

  // Generate vertical ribs with enhanced detail
  const ribs = useMemo(() => {
    const ribs = []
    for (let i = 0; i < ribCount; i++) {
      const angle = (i / ribCount) * Math.PI * 2
      const x = Math.cos(angle) * (reactorDiameter / 2 + 0.3)
      const z = Math.sin(angle) * (reactorDiameter / 2 + 0.3)
      ribs.push({ position: [x, reactorHeight / 2, z], rotation: [0, angle, 0] })
    }
    return ribs
  }, [reactorDiameter, reactorHeight, ribCount])

  // Generate ring seams with enhanced structural detail
  const rings = useMemo(() => {
    const rings = []
    for (let i = 1; i < ringCount; i++) {
      const y = (i / ringCount) * reactorHeight
      rings.push({ position: [0, y, 0], scale: [reactorDiameter + 0.5, 0.3, reactorDiameter + 0.5] })
    }
    return rings
  }, [reactorDiameter, reactorHeight, ringCount])

  const fuelAssemblies = useMemo(() => {
    const assemblies = []
    const gridSize = 13 // 13x13 grid for 169 assemblies (typical PWR)
    const spacing = 0.8
    const startX = (-(gridSize - 1) * spacing) / 2
    const startZ = (-(gridSize - 1) * spacing) / 2

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = startX + i * spacing
        const z = startZ + j * spacing
        const distance = Math.sqrt(x * x + z * z)

        // Only place assemblies within reactor core radius
        if (distance < reactorDiameter / 3) {
          assemblies.push({
            position: [x, 8, z],
            height: 12,
          })
        }
      }
    }
    return assemblies
  }, [reactorDiameter])

  const controlRods = useMemo(() => {
    const rods = []
    const rodCount = 24
    for (let i = 0; i < rodCount; i++) {
      const angle = (i / rodCount) * Math.PI * 2
      const radius = reactorDiameter / 4
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      rods.push({
        position: [x, 15, z],
        drivePosition: [x, 25, z],
      })
    }
    return rods
  }, [reactorDiameter])

  const coolantPumps = useMemo(() => {
    const pumps = []
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const radius = reactorDiameter / 2 + 5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      pumps.push({
        position: [x, 6, z],
        angle: angle,
      })
    }
    return pumps
  }, [reactorDiameter])

  return (
    <group ref={meshRef} position={explodeOffset}>
      {/* Main cylindrical containment with enhanced surface detail */}
      <mesh position={[0, reactorHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[reactorDiameter / 2, reactorDiameter / 2, reactorHeight, 64]} />
        <meshStandardMaterial color="#8B8680" roughness={0.9} metalness={0} normalScale={[0.5, 0.5]} />
      </mesh>

      {/* Hemispherical dome with enhanced geometry */}
      <mesh position={[0, reactorHeight + domeHeight / 2, 0]} castShadow>
        <sphereGeometry args={[reactorDiameter / 2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B8680" roughness={0.9} metalness={0} />
      </mesh>

      {/* Enhanced vertical ribs with mounting brackets */}
      {ribs.map((rib, index) => (
        <group key={`rib-group-${index}`}>
          <mesh
            position={rib.position as [number, number, number]}
            rotation={rib.rotation as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[0.5, reactorHeight, 0.8]} />
            <meshStandardMaterial color="#7A7470" roughness={0.9} metalness={0} />
          </mesh>
          {/* Mounting brackets */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={`bracket-${i}`}
              position={[
                rib.position[0] + Math.cos(rib.rotation[1]) * 0.6,
                rib.position[1] - reactorHeight / 2 + (i + 1) * (reactorHeight / 6),
                rib.position[2] + Math.sin(rib.rotation[1]) * 0.6,
              ]}
              rotation={rib.rotation as [number, number, number]}
              castShadow
            >
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#5A5550" roughness={0.8} metalness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Enhanced ring seams with bolt details */}
      {rings.map((ring, index) => (
        <group key={`ring-group-${index}`}>
          <mesh
            position={ring.position as [number, number, number]}
            scale={ring.scale as [number, number, number]}
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.3, 64]} />
            <meshStandardMaterial color="#7A7470" roughness={0.9} metalness={0} />
          </mesh>
          {/* Bolt details around ring */}
          {Array.from({ length: 32 }, (_, i) => {
            const angle = (i / 32) * Math.PI * 2
            const boltRadius = reactorDiameter / 2 + 0.8
            const x = Math.cos(angle) * boltRadius
            const z = Math.sin(angle) * boltRadius
            return (
              <mesh key={`bolt-${i}`} position={[x, ring.position[1], z]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                <meshStandardMaterial color="#4A4A4A" roughness={0.3} metalness={0.9} />
              </mesh>
            )
          })}
        </group>
      ))}

      <group>
        {fuelAssemblies.map((assembly, index) => (
          <group key={`fuel-assembly-${index}`}>
            {/* Fuel rod bundle */}
            <mesh position={assembly.position as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, assembly.height, 8]} />
              <meshStandardMaterial color="#2D3748" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Top nozzle */}
            <mesh
              position={[assembly.position[0], assembly.position[1] + assembly.height / 2 + 0.3, assembly.position[2]]}
              castShadow
            >
              <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Bottom nozzle */}
            <mesh
              position={[assembly.position[0], assembly.position[1] - assembly.height / 2 - 0.3, assembly.position[2]]}
              castShadow
            >
              <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      <group>
        {controlRods.map((rod, index) => (
          <group key={`control-rod-${index}`}>
            {/* Control rod */}
            <mesh position={rod.position as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 10, 8]} />
              <meshStandardMaterial color="#1A202C" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Drive mechanism */}
            <mesh position={rod.drivePosition as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 2, 12]} />
              <meshStandardMaterial color="#2D3748" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Drive shaft */}
            <mesh
              position={[rod.position[0], (rod.position[1] + rod.drivePosition[1]) / 2, rod.position[2]]}
              castShadow
            >
              <cylinderGeometry args={[0.05, 0.05, Math.abs(rod.drivePosition[1] - rod.position[1]), 8]} />
              <meshStandardMaterial color="#4A5568" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      <group>
        {coolantPumps.map((pump, index) => (
          <group key={`coolant-pump-${index}`}>
            {/* Main pump casing */}
            <mesh position={pump.position as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
              <meshStandardMaterial color="#2D3748" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Pump impeller housing */}
            <mesh position={[pump.position[0], pump.position[1] + 2.5, pump.position[2]]} castShadow>
              <cylinderGeometry args={[1.2, 1.2, 1, 16]} />
              <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Motor assembly */}
            <mesh position={[pump.position[0], pump.position[1] + 4, pump.position[2]]} castShadow>
              <cylinderGeometry args={[0.8, 0.8, 2, 12]} />
              <meshStandardMaterial color="#1A202C" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Suction piping */}
            <mesh
              position={[
                pump.position[0] + Math.cos(pump.angle) * 2,
                pump.position[1],
                pump.position[2] + Math.sin(pump.angle) * 2,
              ]}
              rotation={[0, pump.angle, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.6, 0.6, 8, 16]} />
              <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Discharge piping */}
            <mesh
              position={[
                pump.position[0] - Math.cos(pump.angle) * 2,
                pump.position[1] + 1,
                pump.position[2] - Math.sin(pump.angle) * 2,
              ]}
              rotation={[0, pump.angle + Math.PI, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.6, 0.6, 8, 16]} />
              <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Pump foundation */}
            <mesh position={[pump.position[0], pump.position[1] - 3, pump.position[2]]} receiveShadow>
              <boxGeometry args={[4, 2, 4]} />
              <meshStandardMaterial color="#1A202C" roughness={0.8} metalness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      <group>
        {Array.from({ length: 2 }, (_, i) => {
          const x = i === 0 ? -18 : 18
          return (
            <group key={`steam-gen-group-${i}`}>
              {/* Main steam generator vessel */}
              <mesh position={[x, 6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[3, 3, 12, 32]} />
                <meshStandardMaterial color="#718096" roughness={0.6} metalness={0.4} />
              </mesh>
              {/* Steam generator internals - tube bundle */}
              <mesh position={[x, 6, 0]} castShadow>
                <cylinderGeometry args={[2.5, 2.5, 10, 24]} />
                <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Steam outlet nozzles */}
              {Array.from({ length: 4 }, (_, j) => {
                const angle = (j / 4) * Math.PI * 2
                const nozzleX = x + Math.cos(angle) * 3.2
                const nozzleZ = Math.sin(angle) * 3.2
                return (
                  <mesh
                    key={`nozzle-${j}`}
                    position={[nozzleX, 10, nozzleZ]}
                    rotation={[0, angle, Math.PI / 2]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.4, 0.4, 2, 12]} />
                    <meshStandardMaterial color="#2D3748" roughness={0.2} metalness={0.9} />
                  </mesh>
                )
              })}
              {/* Feedwater inlet */}
              <mesh position={[x, 2, 3.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 1.5, 12]} />
                <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.9} />
              </mesh>
            </group>
          )
        })}
      </group>

      <group>
        <mesh position={[0, 8, -reactorDiameter / 2 - 8]} castShadow receiveShadow>
          <boxGeometry args={[12, 6, 8]} />
          <meshStandardMaterial color="#A0AEC0" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Control room windows */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`window-${i}`} position={[(i - 2.5) * 1.8, 8, -reactorDiameter / 2 - 4.1]} castShadow>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshPhysicalMaterial color="#87CEEB" roughness={0.1} transmission={0.9} transparent opacity={0.3} />
          </mesh>
        ))}
        {/* Control panels inside */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`control-panel-${i}`} position={[(i - 1.5) * 2.5, 6, -reactorDiameter / 2 - 6]} castShadow>
            <boxGeometry args={[2, 2, 1]} />
            <meshStandardMaterial color="#2B6CB0" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}
      </group>

      <group>
        {Array.from({ length: 3 }, (_, i) => {
          const angle = (i / 3) * Math.PI * 2
          const x = Math.cos(angle) * (reactorDiameter / 2 + 1)
          const z = Math.sin(angle) * (reactorDiameter / 2 + 1)
          return (
            <group key={`stair-group-${i}`}>
              {/* Main stairway */}
              <mesh position={[x, reactorHeight / 2, z]} castShadow>
                <boxGeometry args={[1, reactorHeight, 0.3]} />
                <meshStandardMaterial color="#4A5568" roughness={0.9} metalness={0.8} />
              </mesh>
              {/* Railings */}
              <mesh position={[x + 0.6, reactorHeight / 2, z]} castShadow>
                <boxGeometry args={[0.1, reactorHeight, 0.1]} />
                <meshStandardMaterial color="#2D3748" roughness={0.8} metalness={0.9} />
              </mesh>
              <mesh position={[x - 0.6, reactorHeight / 2, z]} castShadow>
                <boxGeometry args={[0.1, reactorHeight, 0.1]} />
                <meshStandardMaterial color="#2D3748" roughness={0.8} metalness={0.9} />
              </mesh>
              {/* Landing platforms */}
              {Array.from({ length: 3 }, (_, j) => (
                <mesh
                  key={`platform-${j}`}
                  position={[x, (j + 1) * (reactorHeight / 4), z + 1]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[2, 0.2, 2]} />
                  <meshStandardMaterial color="#4A5568" roughness={0.8} metalness={0.7} />
                </mesh>
              ))}
            </group>
          )
        })}
      </group>

      <group>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = reactorDiameter / 2 - 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <group key={`spray-system-${i}`}>
              {/* Spray header */}
              <mesh position={[x, reactorHeight - 3, z]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 4, 12]} />
                <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Spray nozzles */}
              {Array.from({ length: 6 }, (_, j) => (
                <mesh key={`nozzle-${j}`} position={[x, reactorHeight - 5 + j * 0.5, z]} castShadow>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="#2D3748" roughness={0.2} metalness={0.9} />
                </mesh>
              ))}
            </group>
          )
        })}
      </group>
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
  const skylightCount = 8
  const roofPitch = 0.1

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

      {/* Detailed turbine generators inside the hall */}
      <group>
        {Array.from({ length: 3 }, (_, i) => {
          const x = (i - 1) * 25
          return (
            <group key={`turbine-${i}`}>
              {/* Main turbine body */}
              <mesh position={[x, 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[3, 3, 20, 16]} />
                <meshStandardMaterial color="#2D3748" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Generator */}
              <mesh position={[x, 4, 8]} castShadow receiveShadow>
                <cylinderGeometry args={[2.5, 2.5, 8, 16]} />
                <meshStandardMaterial color="#4A5568" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Turbine base */}
              <mesh position={[x, 1, 0]} receiveShadow>
                <boxGeometry args={[8, 2, 6]} />
                <meshStandardMaterial color="#1A202C" roughness={0.8} metalness={0.5} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Overhead crane system */}
      <group>
        <mesh position={[0, hallHeight - 2, 0]} castShadow>
          <boxGeometry args={[hallLength - 5, 1, 2]} />
          <meshStandardMaterial color="#E53E3E" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, hallHeight - 2, hallWidth / 2 - 1]} castShadow>
          <boxGeometry args={[hallLength - 5, 1, 1]} />
          <meshStandardMaterial color="#E53E3E" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, hallHeight - 2, -hallWidth / 2 + 1]} castShadow>
          <boxGeometry args={[hallLength - 5, 1, 1]} />
          <meshStandardMaterial color="#E53E3E" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Electrical panels and control systems */}
      <group>
        {Array.from({ length: 6 }, (_, i) => {
          const x = (i - 2.5) * 12
          return (
            <mesh key={`panel-${i}`} position={[x, 2, hallWidth / 2 - 2]} castShadow receiveShadow>
              <boxGeometry args={[2, 4, 1]} />
              <meshStandardMaterial color="#2B6CB0" roughness={0.6} metalness={0.4} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

interface AuxiliaryBlocksProps {
  exploded?: boolean
}

export function AuxiliaryBlocks({ exploded = false }: AuxiliaryBlocksProps) {
  const blockCount = 6
  const blockSpread = 40
  const minHeight = 8
  const maxHeight = 20

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

          {/* HVAC units on roof */}
          <mesh
            position={[block.position[0], block.position[1] + block.scale[1] / 2 + 0.5, block.position[2]]}
            castShadow
          >
            <boxGeometry args={[block.scale[0] * 0.3, 1, block.scale[2] * 0.3]} />
            <meshStandardMaterial color="#6B7280" roughness={0.7} metalness={0.6} />
          </mesh>

          {/* Windows */}
          {Array.from({ length: Math.floor(block.scale[1] / 3) }, (_, i) => (
            <mesh
              key={`window-${i}`}
              position={[
                block.position[0] + block.scale[0] / 2 + 0.05,
                block.position[1] - block.scale[1] / 2 + (i + 1) * 3,
                block.position[2],
              ]}
              castShadow
            >
              <boxGeometry args={[0.1, 1.5, 2]} />
              <meshPhysicalMaterial color="#87CEEB" roughness={0.1} transmission={0.9} transparent opacity={0.3} />
            </mesh>
          ))}

          {/* Entrance door */}
          <mesh
            position={[
              block.position[0] - block.scale[0] / 2 - 0.05,
              block.position[1] - block.scale[1] / 2 + 1,
              block.position[2],
            ]}
            castShadow
          >
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#2D3748" roughness={0.8} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
