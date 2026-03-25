import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function WireframeDottedGlobe({ width = 600, height = 600, className = "" }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Set up responsive dimensions - fitting in container
    const containerWidth = width
    const containerHeight = height
    // Make radius slightly smaller to fit padding
    const radius = Math.min(containerWidth, containerHeight) / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    // Create projection and path generator for Canvas
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point, polygon) => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point, feature) => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) {
          return false
        }
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false // Point is in a hole
          }
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) {
              return true
            }
          }
        }
        return false
      }

      return false
    }

    const generateDotsInPolygon = (feature, dotSpacing = 22) => {
      const dots = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds

      const stepSize = dotSpacing * 0.08

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }

      return dots
    }

    const allDots = []
    let landFeatures

    const render = () => {
      // Clear canvas
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw ocean (globe background) - 3D Sphere shading
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      
      // Volumetric 3D gradient to make it look like a round sphere
      const gradient = context.createRadialGradient(
        containerWidth / 2 - currentScale * 0.4, 
        containerHeight / 2 - currentScale * 0.4, 
        currentScale * 0.1,
        containerWidth / 2,
        containerHeight / 2,
        currentScale
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)")       // Bright highlight
      gradient.addColorStop(0.5, "rgba(240, 245, 255, 0.9)")   // Mid tone
      gradient.addColorStop(0.9, "rgba(200, 215, 245, 0.7)")   // Shaded edge
      gradient.addColorStop(1, "rgba(160, 180, 235, 0.4)")     // Darker rim
      
      context.fillStyle = gradient
      context.fill()
      
      // Globe outline (soft indigo ring to define edges cleanly)
      context.strokeStyle = "rgba(79, 70, 229, 0.3)"
      context.lineWidth = 1.5 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Draw graticule (grid lines)
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "rgba(148, 163, 184, 0.15)" // Subtle slate gray
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw land outlines 
        context.beginPath()
        landFeatures.features.forEach((feature) => {
          path(feature)
        })
        context.strokeStyle = "rgba(79, 70, 229, 0.4)" // Semi-transparent indigo
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw halftone dots with depth fading
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (projected) {
             const dx = projected[0] - containerWidth / 2
             const dy = projected[1] - containerHeight / 2
             const distSq = dx * dx + dy * dy
             const maxDistSq = currentScale * currentScale
             
             // Only draw if inside the radius
             if (distSq < maxDistSq) {
               // Calculate how close the dot is to the horizon (edge of sphere)
               const distNormalized = Math.sqrt(distSq) / currentScale
               // Opacity drops heavily as the dot wraps around the curve
               const depthAlpha = 0.85 * (1 - Math.pow(distNormalized, 2.5))
               
               // Avoid rendering dots that are completely invisible or bunched up at horizon
               if (depthAlpha > 0.05) {
                 context.beginPath()
                 context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI)
                 context.fillStyle = `rgba(79, 70, 229, ${depthAlpha})`
                 context.fill()
               }
             }
          }
        })
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)

        // Use standard CDN instead of raw Github for faster download
        const response = await fetch(
          "https://cdn.jsdelivr.net/gh/martynafford/natural-earth-geojson@master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()

        // Yield to main thread so the loading spinner can animate and UI doesn't freeze
        await new Promise(resolve => setTimeout(resolve, 50))

        // Generate dots (using the optimized dotSpacing = 22)
        landFeatures.features.forEach((feature) => {
          const dots = generateDotsInPolygon(feature, 22)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true })
          })
        })

        render()
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    // Set up rotation ONLY (no interaction matching your request)
    const rotation = [0, 0]
    let autoRotate = true
    const rotationSpeed = 0.5

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation)
        render()
      }
    }

    // Auto-rotation timer
    const rotationTimer = d3.timer(rotate)

    // Load the world data
    loadWorldData()

    // Cleanup
    return () => {
      rotationTimer.stop()
    }
  }, [width, height])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-transparent rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 1s ease" }}
      />
    </div>
  )
}
