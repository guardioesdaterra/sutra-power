"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CuboidIcon as Cube, Eye } from "lucide-react"
import { ModelViewer } from "@/components/model-viewer"
import { getModels, getCharacters } from "@/lib/data"

export default function ModelsPage() {
  const [models, setModels] = useState([])
  const [characters, setCharacters] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelsData = await getModels()
        const charactersData = await getCharacters()

        // Create a map of character IDs to names for quick lookup
        const characterMap = {}
        charactersData.forEach((char) => {
          characterMap[char.id] = char.name
        })

        setModels(modelsData)
        setCharacters(characterMap)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading models data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">3D Models</h1>
          <p className="text-muted-foreground">Browse and interact with 3D models of all 54 characters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-square w-full h-[200px] bg-muted/30 rounded-lg overflow-hidden">
                <ModelViewer modelUrl={model.modelUrl} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{model.description}</p>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
              <Link href={`/models/${model.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  View Full Model
                </Button>
              </Link>
              <Link href={`/characters/${model.characterId}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Cube className="h-4 w-4" />
                  View Character
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
