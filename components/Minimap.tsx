"use client"

import { Card } from "@/components/ui/card"

export function Minimap() {
  return (
    <Card className="w-48 h-48 p-2 bg-custom-panel/90 backdrop-blur-sm border-border/50">
      <div className="relative w-full h-full">
        <div className="w-full h-full rounded border border-border/30 bg-gradient-to-br from-blue-900/20 to-green-900/20 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Minimap</div>
        </div>

        {/* Camera frustum indicator */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-brand rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 border border-brand/50 rounded transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </Card>
  )
}
