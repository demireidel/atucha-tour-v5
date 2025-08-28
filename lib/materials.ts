import { MeshStandardMaterial, MeshPhysicalMaterial } from "three"

// Concrete material for reactor building
export const concreteMaterial = new MeshStandardMaterial({
  color: "#8B8680",
  roughness: 0.9,
  metalness: 0,
  normalScale: [0.5, 0.5],
})

// Metal material for turbine hall and auxiliary buildings
export const metalMaterial = new MeshStandardMaterial({
  color: "#B0B8C1",
  roughness: 0.3,
  metalness: 0.8,
})

// Water material with physical properties
export const waterMaterial = new MeshPhysicalMaterial({
  color: "#1e40af",
  roughness: 0.1,
  metalness: 0,
  transmission: 0.9,
  thickness: 0.5,
  transparent: true,
  opacity: 0.8,
})

// Ground/terrain material
export const terrainMaterial = new MeshStandardMaterial({
  color: "#4A5D23",
  roughness: 0.8,
  metalness: 0,
})

// Road material
export const roadMaterial = new MeshStandardMaterial({
  color: "#2D2D2D",
  roughness: 0.7,
  metalness: 0,
})
