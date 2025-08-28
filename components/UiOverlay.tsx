"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { Info, Layers, Camera, Settings, RotateCcw, Play, Pause, Zap, Eye, Grid } from "lucide-react"
import { AboutModal } from "./AboutModal"

export default function UiOverlay() {
  const {
    setAboutModalOpen,
    aboutModalOpen,
    exploded,
    setExploded,
    annotations,
    setAnnotations,
    quality,
    setQuality,
    wireframe,
    setWireframe,
    shadows,
    setShadows,
    autoRotate,
    setAutoRotate,
    fps,
    resetView,
  } = useAppStore()

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = `atucha-ii-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    }
  }

  return (
    <div className="ui-overlay">
      {/* Main header */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <Card className="ui-panel">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="font-bold text-xl text-primary">Atucha II Nuclear Plant</h1>
              <p className="text-sm text-muted-foreground">Interactive 3D Visualization • {fps} FPS</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={exploded ? "default" : "outline"} size="sm" onClick={() => setExploded(!exploded)}>
                <Layers className="h-4 w-4 mr-2" />
                {exploded ? "Normal" : "Exploded"}
              </Button>

              <Button
                variant={annotations ? "default" : "outline"}
                size="sm"
                onClick={() => setAnnotations(!annotations)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Labels
              </Button>

              <Button variant={autoRotate ? "default" : "outline"} size="sm" onClick={() => setAutoRotate(!autoRotate)}>
                {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={handleScreenshot}>
                <Camera className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm" onClick={() => setAboutModalOpen(true)}>
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced controls panel */}
      <div className="absolute bottom-4 left-4 z-50">
        <Card className="ui-panel">
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Controls
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Button variant={wireframe ? "default" : "outline"} size="sm" onClick={() => setWireframe(!wireframe)}>
                <Grid className="h-4 w-4 mr-2" />
                Wireframe
              </Button>

              <Button variant={shadows ? "default" : "outline"} size="sm" onClick={() => setShadows(!shadows)}>
                <Zap className="h-4 w-4 mr-2" />
                Shadows
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Quality</label>
              <div className="grid grid-cols-4 gap-1">
                {(["low", "medium", "high", "ultra"] as const).map((q) => (
                  <Button
                    key={q}
                    variant={quality === q ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuality(q)}
                    className="text-xs"
                  >
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={resetView} className="w-full bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </Card>
      </div>

      <AboutModal open={aboutModalOpen} onOpenChange={setAboutModalOpen} />
    </div>
  )
}
