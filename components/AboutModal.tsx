"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Atucha II Nuclear Power Plant</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Interactive 3D visualization of Argentina's Atucha II nuclear power plant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">About the Plant</h3>
            <p className="text-muted-foreground leading-relaxed">
              Atucha II is a pressurized heavy water reactor (PHWR) located in Lima, Buenos Aires Province, Argentina.
              This visualization shows the exterior structures including the reactor containment building, turbine hall,
              and supporting infrastructure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Interactive 3D geometry with real-time controls</li>
              <li>Exploded view for detailed inspection</li>
              <li>Annotation system for educational purposes</li>
              <li>Screenshot capability for documentation</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Educational Purpose</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-xs leading-relaxed">
              This is an educational visualization for demonstration purposes only. It does not represent actual plant
              specifications or operational procedures.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Controls</h3>
            <div className="text-xs space-y-1">
              <p>
                <kbd className="bg-muted px-1 rounded">Mouse</kbd> Orbit, zoom, and pan camera
              </p>
              <p>
                <kbd className="bg-muted px-1 rounded">Exploded</kbd> Toggle exploded view
              </p>
              <p>
                <kbd className="bg-muted px-1 rounded">Annotations</kbd> Show/hide labels
              </p>
              <p>
                <kbd className="bg-muted px-1 rounded">Screenshot</kbd> Capture current view
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
