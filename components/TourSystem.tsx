"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useAppStore } from "@/lib/store"
import * as THREE from "three"

export function TourSystem() {
  const { camera } = useThree()
  const { currentTour, tourProgress, isPlaying, tours, setTourProgress, stopTour } = useAppStore()
  const startTimeRef = useRef<number>(0)
  const currentKeyframeRef = useRef<number>(0)

  const tour = tours.find((t) => t.id === currentTour)

  useFrame((state, delta) => {
    if (!tour || !isPlaying) return

    if (startTimeRef.current === 0) {
      startTimeRef.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current
    const progress = Math.min(elapsed / tour.duration, 1)

    setTourProgress(progress)

    if (progress >= 1) {
      stopTour()
      startTimeRef.current = 0
      currentKeyframeRef.current = 0
      return
    }

    // Find current keyframe
    let totalDuration = 0
    let currentKeyframe = 0

    for (let i = 0; i < tour.keyframes.length; i++) {
      totalDuration += tour.keyframes[i].duration
      if ((elapsed * tour.duration) / 100 <= totalDuration) {
        currentKeyframe = i
        break
      }
    }

    const keyframe = tour.keyframes[currentKeyframe]
    const nextKeyframe = tour.keyframes[currentKeyframe + 1]

    if (keyframe && nextKeyframe) {
      // Calculate interpolation between keyframes
      const keyframeStart = tour.keyframes.slice(0, currentKeyframe).reduce((sum, kf) => sum + kf.duration, 0)
      const keyframeProgress = Math.min(((elapsed * tour.duration) / 100 - keyframeStart) / keyframe.duration, 1)

      // Smooth interpolation
      const t = 0.5 * (1 - Math.cos(keyframeProgress * Math.PI))

      // Interpolate position
      const pos = new THREE.Vector3().fromArray(keyframe.position)
      const nextPos = new THREE.Vector3().fromArray(nextKeyframe.position)
      camera.position.lerpVectors(pos, nextPos, t)

      // Interpolate target
      const target = new THREE.Vector3().fromArray(keyframe.target)
      const nextTarget = new THREE.Vector3().fromArray(nextKeyframe.target)
      const currentTarget = new THREE.Vector3().lerpVectors(target, nextTarget, t)
      camera.lookAt(currentTarget)
    } else if (keyframe) {
      // Final keyframe
      camera.position.fromArray(keyframe.position)
      camera.lookAt(new THREE.Vector3().fromArray(keyframe.target))
    }
  })

  useEffect(() => {
    if (!isPlaying) {
      startTimeRef.current = 0
    }
  }, [isPlaying])

  return null
}
