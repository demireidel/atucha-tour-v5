"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { Info, Layers, Camera } from "lucide-react"
import { AboutModal } from "./AboutModal"

export default function UiOverlay() {
  const { setAboutModalOpen, aboutModalOpen, exploded, setExploded, annotations, setAnnotations } = useAppStore()

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = `atucha-ii-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="ui-overlay">
      <div className="absolute top-4 left-4 right-4 z-50">
        <Card className="ui-panel">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-xl" style={{ color: "var(--color-brand)" }}>
              Atucha II Nuclear Plant
            </h1>

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
                Annotations
              </Button>

              <Button variant="outline" size="sm" onClick={handleScreenshot}>
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
              </Button>

              <Button variant="outline" size="sm" onClick={() => setAboutModalOpen(true)}>
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AboutModal open={aboutModalOpen} onOpenChange={setAboutModalOpen} />
    </div>
  )
}
