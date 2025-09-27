"use client"

import { useState, useEffect } from "react"
import { blueEcosystems } from "@/lib/mock-data"

// Simple 2D map component for now
function SimpleMap({ onEcosystemClick }: { onEcosystemClick: (ecosystem: (typeof blueEcosystems)[0]) => void }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden">
      {/* India outline SVG */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified India outline */}
        <path
          d="M 50 200 L 100 180 L 150 160 L 200 150 L 250 160 L 300 180 L 320 200 L 310 220 L 280 240 L 250 250 L 200 260 L 150 250 L 100 240 L 70 220 Z"
          fill="#f8fafc"
          stroke="#16a34a"
          strokeWidth="2"
        />
        
        {/* Ecosystem markers */}
        {blueEcosystems.map((ecosystem) => {
          // Convert coordinates to SVG positions (simplified)
          const x = ((ecosystem.coordinates[0] - 68) / 30) * 300 + 50
          const y = ((ecosystem.coordinates[1] - 6) / 20) * 200 + 50
          
          return (
            <g key={ecosystem.id}>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={ecosystem.ecosystemType === "Mangrove" ? "#16a34a" : "#059669"}
                className="cursor-pointer hover:r-12 transition-all duration-200"
                onClick={() => onEcosystemClick(ecosystem)}
              />
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {ecosystem.name.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* Title */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border">
        <h3 className="font-semibold text-primary text-sm">Blue Carbon Ecosystems of India</h3>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground font-medium">Loading 3D Map...</p>
        <p className="text-xs text-muted-foreground mt-1">Rendering blue carbon ecosystems</p>
      </div>
    </div>
  )
}

function ErrorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
      <div className="text-center">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">⚠</span>
        </div>
        <p className="text-red-600 font-medium">Failed to load 3D Map</p>
        <p className="text-xs text-red-500 mt-1">Please refresh the page</p>
      </div>
    </div>
  )
}

interface IndianMapProps {
  onEcosystemSelect?: (ecosystem: (typeof blueEcosystems)[0]) => void
  className?: string
}

export function IndianMap({ onEcosystemSelect, className = "" }: IndianMapProps) {
  const [selectedEcosystem, setSelectedEcosystem] = useState<(typeof blueEcosystems)[0] | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEcosystemClick = (ecosystem: (typeof blueEcosystems)[0]) => {
    console.log("[v0] Ecosystem selected:", ecosystem.name)
    setSelectedEcosystem(ecosystem)
    onEcosystemSelect?.(ecosystem)
  }

  const handleError = () => {
    console.log("[v0] 3D Map rendering error")
    setHasError(true)
  }

  if (!isClient) {
    return (
      <div className={`relative ${className}`}>
        <LoadingFallback />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`relative ${className}`}>
        <ErrorFallback />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <SimpleMap onEcosystemClick={handleEcosystemClick} />

      {selectedEcosystem && (
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border max-w-sm animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-primary pr-2">{selectedEcosystem.name}</h3>
            <button
              onClick={() => setSelectedEcosystem(null)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">State:</span>
              <span className="font-medium">{selectedEcosystem.state}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Area:</span>
              <span className="font-medium">{selectedEcosystem.area} km²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Carbon Stock:</span>
              <span className="font-medium text-green-600">{selectedEcosystem.carbonStock} tCO₂</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{selectedEcosystem.ecosystemType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600">{selectedEcosystem.status}</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border">
        <h4 className="font-semibold text-sm mb-2 text-primary">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full shadow-sm"></div>
            <span>Mangrove Ecosystems</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-600 rounded-full shadow-sm"></div>
            <span>Coastal Wetlands</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Click markers for details • Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  )
}
