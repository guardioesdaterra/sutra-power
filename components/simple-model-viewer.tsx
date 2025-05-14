"use client"

import { useEffect, useRef, useState } from "react"

interface SimpleModelViewerProps {
  modelUrl: string
  alt?: string
}

// Utility function to normalize model URLs
const useCustomMemo = (fn: () => string, deps: React.DependencyList): string | null => {
  const [value, setValue] = useState<string | null>(null)
  
  useEffect(() => {
    setValue(fn())
  }, [fn, deps]); // Changed from [fn, ...deps] to [fn, deps]
  
  return value
}

export function SimpleModelViewer({ modelUrl, alt = "3D model" }: SimpleModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Normalize model URL - ensure it doesn't contain IP addresses
  const normalizedModelUrl = useCustomMemo(() => {
    try {
      if (!modelUrl) return "/assets/astronaut.glb"
      
      // Check if URL contains IP address or localhost
      if (/^https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost)/.exec(modelUrl)) {
        // Extract path and use it relative to our domain
        const url = new URL(modelUrl)
        return url.pathname
      }
      
      return modelUrl
    } catch {
      return modelUrl
    }
  }, [modelUrl])

  // Carrega o script do model-viewer
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
      setErrorMessage("Failed to load 3D viewer script")
      setIsLoading(false)
    }
    
    document.head.appendChild(script)
    
    return () => {
      // Não removemos o script para não afetar outras instâncias
    }
  }, [])

  // Cria o model-viewer quando o script estiver carregado
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return
    
    // Cleanup any previous model-viewer
    if (containerRef.current.firstChild) {
      containerRef.current.innerHTML = ''
    }

    const currentContainer = containerRef.current; // For cleanup
    try {
      // Espera um momento para garantir que o custom element está registrado
      setTimeout(() => {
        if (!currentContainer) return

        // Fallback model if URL is missing or invalid
        const fallbackModel = "/assets/astronaut.glb"
        const modelToUse = normalizedModelUrl ?? fallbackModel
        
        const modelViewerHtml = `
          <model-viewer
            src="${modelToUse}"
            alt="${alt}"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style="width: 100%; height: 100%; background-color: transparent;"
            loading="eager"
          ></model-viewer>
        `
        currentContainer.innerHTML = modelViewerHtml

        // Obtém o elemento criado
        const modelViewerElement = currentContainer.querySelector('model-viewer')
        
        if (modelViewerElement) {
          // Adiciona evento de load
          modelViewerElement.addEventListener('load', () => {
            setIsLoading(false)
            setError(false)
            setErrorMessage("")
            console.log('Model loaded successfully:', modelToUse)
          })
          
          // Adiciona evento de erro
          modelViewerElement.addEventListener('error', (event) => {
            console.error('Error loading model:', modelToUse, event)
            
            if (modelToUse !== fallbackModel) {
              console.log('Trying fallback model...')
              
              // Try the fallback model if the original fails
              const fallbackViewerHtml = `
                <model-viewer
                  src="${fallbackModel}"
                  alt="${alt}"
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  style="width: 100%; height: 100%; background-color: transparent;"
                  loading="eager"
                ></model-viewer>
              `
              
              if (currentContainer) {
                currentContainer.innerHTML = fallbackViewerHtml
                
                const fallbackElement = currentContainer.querySelector('model-viewer')
                if (fallbackElement) {
                  fallbackElement.addEventListener('load', () => {
                    setIsLoading(false)
                    setError(false)
                    setErrorMessage("Original model not found, using fallback")
                  })
                  
                  fallbackElement.addEventListener('error', () => {
                    setError(true)
                    setErrorMessage(`Failed to load both model (${modelToUse}) and fallback`)
                    setIsLoading(false)
                  })
                }
              }
            } else {
              setError(true)
              setErrorMessage(`Failed to load model: ${modelToUse}`)
              setIsLoading(false)
            }
          })

          // Define um timeout de segurança para evitar carregamento infinito
          setTimeout(() => {
            if (isLoading) {
              console.warn('Model loading timed out, forcing state update')
              setIsLoading(false)
              
              if (!error) {
                setError(true)
                setErrorMessage("Model loading timed out")
              }
            }
          }, 15000) // 15 segundos de timeout
        }
      }, 500) // Pequeno delay para garantir que o custom element esteja registrado
    } catch (err) {
      console.error("Error creating model viewer:", err)
      setError(true)
      setErrorMessage(err instanceof Error ? err.message : "Unknown error creating model viewer")
      setIsLoading(false)
    }
    
    return () => {
      // Limpeza ao desmontar
      if (currentContainer) {
        currentContainer.innerHTML = ''
      }
    }
  }, [scriptLoaded, normalizedModelUrl, alt, error, isLoading])

  return (
    <div className="w-full h-full relative">
      {/* Container para o model-viewer */}
      <div ref={containerRef} className="w-full h-full">
        {/* O model-viewer será inserido aqui via innerHTML */}
      </div>

      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Carregando modelo 3D...</p>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center p-4 max-w-md">
            <p className="text-red-500 font-bold mb-2">Erro ao carregar o modelo 3D</p>
            {errorMessage && <p className="text-sm mb-2">{errorMessage}</p>}
            <p className="text-sm opacity-70">Modelo: {normalizedModelUrl}</p>
            <p className="text-xs mt-4">
              Seu dispositivo pode não suportar WebGL ou renderização 3D.
              Tente usar um navegador diferente ou outro dispositivo.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 