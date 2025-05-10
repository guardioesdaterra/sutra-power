"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut, Pause, Play } from "lucide-react"

export function ModelViewer({ modelUrl }) {
  const containerRef = useRef(null)
  const modelViewerRef = useRef(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Carrega o script do model-viewer uma única vez
  useEffect(() => {
    // Verifica se o script já foi carregado
    if (document.querySelector('script[src*="model-viewer"]')) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"
    script.type = "module"
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      console.error("Failed to load model-viewer script")
      setError(true)
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      // Não removemos o script para evitar problemas com outras instâncias
    }
  }, [])

  // Configura o model-viewer quando o script estiver carregado
  useEffect(() => {
    if (!scriptLoaded) return

    let isMounted = true
    let modelViewerElement = null

    const setupModelViewer = async () => {
      try {
        // Aguarda o elemento personalizado ser registrado
        if (!customElements.get("model-viewer")) {
          const checkInterval = setInterval(() => {
            if (customElements.get("model-viewer")) {
              clearInterval(checkInterval)
              createModelViewer()
            }
          }, 100)

          // Timeout de segurança
          setTimeout(() => {
            clearInterval(checkInterval)
            if (isMounted && !customElements.get("model-viewer")) {
              setError(true)
              setIsLoading(false)
            }
          }, 5000)
        } else {
          createModelViewer()
        }
      } catch (err) {
        console.error("Error setting up model viewer:", err)
        if (isMounted) {
          setError(true)
          setIsLoading(false)
        }
      }
    }

    const createModelViewer = () => {
      if (!containerRef.current || !isMounted) return

      // Limpa o container com segurança
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }

      // Cria o elemento model-viewer
      modelViewerElement = document.createElement("model-viewer")
      modelViewerElement.src = modelUrl
      modelViewerElement.alt = "3D model"
      modelViewerElement.setAttribute("camera-controls", "")
      modelViewerElement.setAttribute("auto-rotate", "")
      modelViewerElement.setAttribute("shadow-intensity", "1")
      modelViewerElement.style.width = "100%"
      modelViewerElement.style.height = "100%"
      modelViewerElement.style.backgroundColor = "transparent"

      // Adiciona eventos
      const loadHandler = () => {
        if (isMounted) {
          setIsLoading(false)
          modelViewerRef.current = modelViewerElement
        }
      }

      const errorHandler = () => {
        if (isMounted) {
          setError(true)
          setIsLoading(false)
        }
      }

      modelViewerElement.addEventListener("load", loadHandler)
      modelViewerElement.addEventListener("error", errorHandler)

      // Adiciona ao DOM
      containerRef.current.appendChild(modelViewerElement)

      // Armazena referências para limpeza
      return () => {
        if (modelViewerElement) {
          modelViewerElement.removeEventListener("load", loadHandler)
          modelViewerElement.removeEventListener("error", errorHandler)
        }
      }
    }

    setIsLoading(true)
    setError(false)
    const cleanup = setupModelViewer()

    // Cleanup
    return () => {
      isMounted = false
      if (cleanup) cleanup()
      // Não manipulamos o DOM aqui para evitar o erro
    }
  }, [scriptLoaded, modelUrl])

  const handleZoomIn = () => {
    if (modelViewerRef.current && modelViewerRef.current.getCameraOrbit) {
      try {
        const orbit = modelViewerRef.current.getCameraOrbit()
        const newOrbit = {
          radius: orbit.radius * 0.8,
          theta: orbit.theta,
          phi: orbit.phi,
        }
        modelViewerRef.current.cameraOrbit = `${newOrbit.theta}rad ${newOrbit.phi}rad ${newOrbit.radius}m`
      } catch (error) {
        console.error("Error zooming in:", error)
      }
    }
  }

  const handleZoomOut = () => {
    if (modelViewerRef.current && modelViewerRef.current.getCameraOrbit) {
      try {
        const orbit = modelViewerRef.current.getCameraOrbit()
        const newOrbit = {
          radius: orbit.radius * 1.2,
          theta: orbit.theta,
          phi: orbit.phi,
        }
        modelViewerRef.current.cameraOrbit = `${newOrbit.theta}rad ${newOrbit.phi}rad ${newOrbit.radius}m`
      } catch (error) {
        console.error("Error zooming out:", error)
      }
    }
  }

  const handleRotate = () => {
    if (modelViewerRef.current) {
      try {
        setIsAutoRotating(!isAutoRotating)
        if (isAutoRotating) {
          modelViewerRef.current.removeAttribute("auto-rotate")
        } else {
          modelViewerRef.current.setAttribute("auto-rotate", "")
        }
      } catch (error) {
        console.error("Error toggling rotation:", error)
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      {/* Container para o model-viewer */}
      <div ref={containerRef} className="w-full h-full">
        {/* O model-viewer será inserido aqui via JavaScript */}
      </div>

      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 dark:bg-muted/10 rounded-lg border-2 border-dashed">
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="animate-spin mb-4 mx-auto">
              <RotateCw className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">Loading 3D Model...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 dark:bg-muted/10 rounded-lg border-2 border-dashed">
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg">
            <p className="text-lg font-medium mb-2 text-destructive">Failed to load 3D model</p>
            <p className="text-sm text-muted-foreground mb-4">Model: {modelUrl}</p>
            <p className="text-xs text-muted-foreground">Please check your internet connection and try again.</p>
          </div>
        </div>
      )}

      {/* Controles */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
            onClick={handleRotate}
          >
            {isAutoRotating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
      )}
    </div>
  )
}
