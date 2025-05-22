"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CuboidIcon as Cube } from "lucide-react"
import { ModelViewer } from "@/components/model-viewer"
import { getModel, getCharacter, Model, Character } from "@/lib/data"

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ModelDetailPage({ params }: PageProps) {
  // Unwrap params with use() before accessing properties
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [model, setModel] = useState<Model | null>(null)
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelData = await getModel(Number.parseInt(id))
        if (modelData) {
          setModel(modelData)

          // Fetch the associated character
          const characterData = await getCharacter(modelData.characterId)
          if (characterData) {
            setCharacter(characterData)
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading model data...</p>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Model not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/models" legacyBehavior>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Models
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
          <p className="text-muted-foreground">{model.description}</p>
        </div>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cube className="h-5 w-5" />
            3D Model Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <ModelViewer modelUrl={model.modelUrl} />
          </div>
        </CardContent>
      </Card>
      {character && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Associated Character</h2>
            <p className="text-muted-foreground">{character.name}</p>
          </div>
          <Link href={`/characters/${character.id}`} legacyBehavior>
            <Button>View Character Details</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
