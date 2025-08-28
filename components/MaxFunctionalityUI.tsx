"use client"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Pause,
  Square,
  Camera,
  Grid3X3,
  Frame,
  Film,
  Layers,
  Ruler,
  Settings,
  Shell as Help,
  Scissors,
} from "lucide-react"

export function MaxFunctionalityUI() {
  const store = useAppStore()

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => store.setLayerDrawerOpen(!store.layerDrawerOpen)}>
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
          <Button variant="outline" size="sm" onClick={() => store.setQualityPanelOpen(!store.qualityPanelOpen)}>
            <Settings className="w-4 h-4 mr-2" />
            Quality
          </Button>
          <Button variant="outline" size="sm" onClick={() => store.setCinematicPanelOpen(!store.cinematicPanelOpen)}>
            <Film className="w-4 h-4 mr-2" />
            Cinematic
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => store.setMeasureMode(!store.measureMode)}
            className={store.measureMode ? "bg-blue-500 text-white" : ""}
          >
            <Ruler className="w-4 h-4 mr-2" />
            Measure
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => store.toggleClipping()}
            className={store.clipping.enabled ? "bg-orange-500 text-white" : ""}
          >
            <Scissors className="w-4 h-4 mr-2" />
            Clip
          </Button>
          <Button variant="outline" size="sm" onClick={() => store.setHelpOpen(!store.helpOpen)}>
            <Help className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tour Controls */}
      {store.currentTour && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <Card className="w-96">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{store.tours.find((t) => t.id === store.currentTour)?.name}</h3>
                  <p className="text-sm text-muted-foreground">{Math.round(store.tourProgress * 100)}% complete</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={store.isPlaying ? store.pauseTour : store.resumeTour}>
                    {store.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={store.stopTour}>
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${store.tourProgress * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Layer Drawer */}
      {store.layerDrawerOpen && (
        <div className="absolute top-16 left-4 pointer-events-auto">
          <Card className="w-64">
            <CardHeader>
              <CardTitle className="text-lg">Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(store.layers).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => store.setLayer(key as keyof typeof store.layers, checked)}
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={store.showAllLayers}>
                  Show All
                </Button>
                <Button size="sm" variant="outline" onClick={store.hideAllLayers}>
                  Hide All
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span>Exploded View</span>
                <Switch checked={store.exploded} onCheckedChange={store.setExploded} />
              </div>
              <div className="flex items-center justify-between">
                <span>Annotations</span>
                <Switch checked={store.annotations} onCheckedChange={store.setAnnotations} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quality Panel */}
      {store.qualityPanelOpen && (
        <div className="absolute top-16 left-80 pointer-events-auto">
          <Card className="w-64">
            <CardHeader>
              <CardTitle className="text-lg">Quality Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quality Preset</label>
                <div className="flex gap-1 mt-1">
                  {(["low", "medium", "high", "auto"] as const).map((quality) => (
                    <Button
                      key={quality}
                      size="sm"
                      variant={store.quality === quality ? "default" : "outline"}
                      onClick={() => store.setQuality(quality)}
                      className="capitalize"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Shadows</span>
                <Switch checked={store.shadows} onCheckedChange={store.setShadows} />
              </div>
              <div className="flex items-center justify-between">
                <span>Anti-aliasing</span>
                <Switch checked={store.antialiasing} onCheckedChange={store.setAntialiasing} />
              </div>
              <div>
                <label className="text-sm font-medium">Environment</label>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {(["dawn", "day", "sunset", "night"] as const).map((preset) => (
                    <Button
                      key={preset}
                      size="sm"
                      variant={store.environmentPreset === preset ? "default" : "outline"}
                      onClick={() => store.setEnvironmentPreset(preset)}
                      className="capitalize"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cinematic Panel */}
      {store.cinematicPanelOpen && (
        <div className="absolute top-16 right-4 pointer-events-auto">
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg">Cinematic Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Cinematic Mode</span>
                <Switch checked={store.cinematicMode} onCheckedChange={store.setCinematicMode} />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={store.recording ? "destructive" : "outline"}
                  onClick={store.recording ? store.stopRecording : store.startRecording}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {store.recording ? "Stop" : "Record"}
                </Button>
                <Button size="sm" variant="outline" onClick={store.toggleGrid}>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button size="sm" variant="outline" onClick={store.toggleLetterbox}>
                  <Frame className="w-4 h-4 mr-2" />
                  Letterbox
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available Tours</h4>
                <div className="space-y-2">
                  {store.tours.map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{tour.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tour.duration}s • {tour.difficulty}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => store.startTour(tour.id)}
                        disabled={store.currentTour === tour.id}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recording Indicator */}
      {store.recording && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">REC</span>
          </div>
        </div>
      )}

      {/* Cinematic Overlays */}
      {store.cinematicMode && (
        <>
          {store.letterbox && (
            <>
              <div className="absolute top-0 left-0 right-0 h-16 bg-black pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-black pointer-events-none" />
            </>
          )}
          {store.showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          )}
          {store.showSafeFrames && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-yellow-400/50" />
              <div className="absolute inset-16 border border-red-400/50" />
            </div>
          )}
        </>
      )}

      {/* Measurement Display */}
      {store.measureMode && store.measurePoints.length > 0 && (
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <Card className="w-64">
            <CardHeader>
              <CardTitle className="text-lg">Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {store.measurePoints.map((point, i) => (
                  <div key={i} className="text-sm">
                    Point {i + 1}: ({point[0].toFixed(1)}, {point[1].toFixed(1)}, {point[2].toFixed(1)})
                  </div>
                ))}
                {store.measurePoints.length >= 2 && (
                  <div className="text-sm font-medium pt-2 border-t">
                    Distance:{" "}
                    {Math.sqrt(
                      Math.pow(store.measurePoints[1][0] - store.measurePoints[0][0], 2) +
                        Math.pow(store.measurePoints[1][1] - store.measurePoints[0][1], 2) +
                        Math.pow(store.measurePoints[1][2] - store.measurePoints[0][2], 2),
                    ).toFixed(2)}{" "}
                    units
                  </div>
                )}
                <Button size="sm" variant="outline" onClick={store.clearMeasurePoints}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
