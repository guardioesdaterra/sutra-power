"use client"

import { useEffect, useState } from 'react'
import { initializeDatabase, isIndexedDBSupported } from './db'
import { useToast } from '@/components/ui/use-toast'

export function AppInitializer() {
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const init = async () => {
      try {
        // Check if IndexedDB is supported
        if (!isIndexedDBSupported()) {
          console.warn("IndexedDB is not supported in this browser. Using fallback storage.")
          toast({
            title: "Armazenamento limitado",
            description: "Seu navegador não suporta armazenamento avançado. Algumas funcionalidades podem ser limitadas.",
            variant: "destructive",
          })
          return
        }

        // Initialize the database
        const success = await initializeDatabase()
        
        if (success) {
          console.log("Database initialized successfully")
          setInitialized(true)
        } else {
          throw new Error("Failed to initialize database")
        }
      } catch (error) {
        console.error("Error initializing app:", error)
        toast({
          title: "Erro de inicialização",
          description: "Houve um problema ao inicializar o armazenamento de dados. Por favor, recarregue a página.",
          variant: "destructive",
        })
      }
    }

    if (typeof window !== 'undefined' && !initialized) {
      void init()
    }

    // Cleanup function
    return () => {
      // Any cleanup needed
    }
  }, [initialized, toast])

  // This component doesn't render anything
  return null
} 