"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut, Pause, Play } from "lucide-react"

interface ModelViewerProps {
  modelUrl: string
  alt?: string
}

// Define a type for the model-viewer element
interface ModelViewerElement extends HTMLElement {
  src: string;
  alt: string;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  getCameraOrbit: () => {
    radius: number;
    theta: number;
    phi: number;
  };
  cameraOrbit: string;
}

export function ModelViewer({ modelUrl, alt = "3D model" }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelViewerRef = useRef<ModelViewerElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const cleanupFunctionsRef = useRef<(() => void)[]>([])
  const isMountedRef = useRef<boolean>(true)

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

  // Função para adicionar funções de limpeza
  const addCleanupFunction = useCallback((fn: () => void) => {
    cleanupFunctionsRef.current.push(fn)
  }, [])

  // Função para carregar o script do model-viewer
  const loadModelViewerScript = useCallback(() => {
    // Verifica se o script já foi carregado
    if (document.querySelector('script[src*="model-viewer"]')) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"
    script.type = "module"
    
    const handleLoad = () => {
      if (isMountedRef.current) {
        setScriptLoaded(true)
      }
    }
    
    const handleError = () => {
      if (isMountedRef.current) {
        console.error("Failed to load model-viewer script")
        setError(true)
        setIsLoading(false)
      }
    }
    
    script.addEventListener("load", handleLoad)
    script.addEventListener("error", handleError)
    document.head.appendChild(script)
    
    // Adiciona função de limpeza para remover event listeners
    addCleanupFunction(() => {
      script.removeEventListener("load", handleLoad)
      script.removeEventListener("error", handleError)
      // Não removemos o script do DOM para evitar problemas com outras instâncias
    })
  }, [addCleanupFunction])

  // Configura o Intersection Observer para lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      setIsVisible(entry.isIntersecting)
    }

    observerRef.current = new IntersectionObserver(handleIntersection, options)
    
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Carrega o script quando o componente se torna visível
  useEffect(() => {
    if (isVisible && !scriptLoaded && !error) {
      loadModelViewerScript()
    }
  }, [isVisible, scriptLoaded, error, loadModelViewerScript])

  // Configura o model-viewer quando o script estiver carregado e o componente estiver visível
  useEffect(() => {
    if (!scriptLoaded || !isVisible) return

    let checkInterval: NodeJS.Timeout | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const setupModelViewer = async () => {
      try {
        // Aguarda o elemento personalizado ser registrado
        if (!customElements.get("model-viewer")) {
          checkInterval = setInterval(() => {
            if (customElements.get("model-viewer")) {
              clearInterval(checkInterval!)
              createModelViewer()
            }
          }, 100)

          // Timeout de segurança
          timeoutId = setTimeout(() => {
            if (checkInterval) clearInterval(checkInterval)
            if (isMountedRef.current && !customElements.get("model-viewer")) {
              setError(true)
              setIsLoading(false)
            }
          }, 5000)
          
          // Adiciona função de limpeza para os timers
          addCleanupFunction(() => {
            if (checkInterval) clearInterval(checkInterval)
            if (timeoutId) clearTimeout(timeoutId)
          })
        } else {
          createModelViewer()
        }
      } catch (err) {
        console.error("Error setting up model viewer:", err)
        if (isMountedRef.current) {
          setError(true)
          setIsLoading(false)
        }
      }
      await Promise.resolve();
    }

    const createModelViewer = () => {
      if (!containerRef.current || !isMountedRef.current) return

      // Limpa o container com segurança
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }

      // Cria o elemento model-viewer
      const modelViewerElement = document.createElement("model-viewer") as ModelViewerElement
      modelViewerElement.src = modelUrl
      modelViewerElement.alt = alt
      modelViewerElement.setAttribute("camera-controls", "")
      modelViewerElement.setAttribute("auto-rotate", "")
      modelViewerElement.setAttribute("shadow-intensity", "1")
      modelViewerElement.style.width = "100%"
      modelViewerElement.style.height = "100%"
      modelViewerElement.style.backgroundColor = "transparent"

      // Adiciona eventos
      const loadHandler = () => {
        if (isMountedRef.current) {
          setIsLoading(false)
          modelViewerRef.current = modelViewerElement
        }
      }

      const errorHandler = () => {
        if (isMountedRef.current) {
          setError(true)
          setIsLoading(false)
        }
      }

      modelViewerElement.addEventListener("load", loadHandler)
      modelViewerElement.addEventListener("error", errorHandler)

      // Adiciona ao DOM
      containerRef.current.appendChild(modelViewerElement)

      // Adiciona função de limpeza para os event listeners e referência
      addCleanupFunction(() => {
        if (modelViewerElement) {
          modelViewerElement.removeEventListener("load", loadHandler)
          modelViewerElement.removeEventListener("error", errorHandler)
          
          // Limpa referências para ajudar o garbage collector
          modelViewerRef.current = null
          
          // Tenta liberar recursos WebGL
          try {
            // Tenta remover o elemento do DOM se ainda estiver presente
            if (containerRef.current?.contains(modelViewerElement)) {
              containerRef.current?.removeChild(modelViewerElement)
            }
          } catch (err) {
            console.error("Error during cleanup:", err)
          }
        }
      })
    }

    setIsLoading(true)
    setError(false)
    void setupModelViewer()

    // Cleanup principal
    return () => {
      // Executa todas as funções de limpeza registradas
      cleanupFunctionsRef.current.forEach(cleanup => cleanup())
      // Limpa o array de funções de limpeza
      cleanupFunctionsRef.current = []
    }
  }, [scriptLoaded, modelUrl, isVisible, alt, addCleanupFunction])

  // Marca o componente como desmontado quando for removido
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Handlers de interação com o modelo
  const handleZoomIn = useCallback(() => {
    if (modelViewerRef.current?.getCameraOrbit) {
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
  }, [])

  const handleZoomOut = useCallback(() => {
    if (modelViewerRef.current?.getCameraOrbit) {
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
  }, [])

  const handleRotate = useCallback(() => {
    if (modelViewerRef.current) {
      try {
        setIsAutoRotating(prevState => {
          const newState = !prevState
          if (newState) {
            modelViewerRef.current?.setAttribute("auto-rotate", "")
          } else {
            modelViewerRef.current?.removeAttribute("auto-rotate")
          }
          return newState
        })
      } catch (error) {
        console.error("Error toggling rotation:", error)
      }
    }
  }, [])

  // Renderiza um placeholder quando não estiver visível
  if (!isVisible) {
    return (
      <div 
        ref={containerRef} 
        className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center"
      >
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">3D Model will load when visible</p>
        </div>
      </div>
    )
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

      {/* Fallback para dispositivos sem suporte a WebGL */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 dark:bg-muted/10 rounded-lg border-2 border-dashed">
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg max-w-md">
            <p className="text-lg font-medium mb-2 text-destructive">Failed to load 3D model</p>
            <p className="text-sm text-muted-foreground mb-4">Model: {modelUrl}</p>
            <p className="text-xs text-muted-foreground mb-2">
              Your device may not support WebGL or 3D rendering.
            </p>
            <p className="text-xs text-muted-foreground">
              Please try using a different browser or device.
            </p>
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
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
            onClick={handleRotate}
            aria-label={isAutoRotating ? "Pause rotation" : "Start rotation"}
          >
            {isAutoRotating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
      )}
    </div>
  )
}
