"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  CuboidIcon as Cube,
  Edit,
  ImageIcon,
  FileText,
  Info,
  History,
  Users,
  MessageSquare,
} from "lucide-react"
import { ModelViewer } from "@/components/model-viewer"
import { getCharacter } from "@/lib/data"
import { CharacterSummary } from "@/components/character-summary"
import { ImageGallery } from "@/components/image-gallery-view"
import { DragonAscii } from "@/components/dragon-ascii"

export default function CharacterDetailPage({ params }) {
  const [character, setCharacter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("main")

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const characterData = await getCharacter(Number.parseInt(params.id))
        if (characterData) {
          setCharacter(characterData)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching character:", error)
        setIsLoading(false)
      }
    }

    fetchCharacter()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <DragonAscii size="small" className="mb-4 floating" />
          <p className="text-lg">Loading character data...</p>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Character not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 dragon-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
          <p className="text-muted-foreground">{character.description}</p>
        </div>
        <Link href={`/characters/${character.id}/edit`}>
          <Button className="gap-2 glow-button">
            <Edit className="h-4 w-4" />
            Edit Character
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="main" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span className="hidden md:inline">Main View</span>
            <span className="md:hidden">Main</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden md:inline">Gallery</span>
            <span className="md:hidden">Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-1">
            <Cube className="h-4 w-4" />
            <span className="hidden md:inline">3D Model</span>
            <span className="md:hidden">3D</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documents</span>
            <span className="md:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden md:inline">Full Chapter</span>
            <span className="md:hidden">Chapter</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <Card className="lg:col-span-1 overflow-hidden neon-border card-hover-effect">
              <div className="relative w-full aspect-square">
                <Image
                  src={character.imageUrl || "/placeholder.svg"}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-xl font-semibold text-white">{character.name}</h2>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm">{character.description}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Link href={`/characters/${character.id}/edit`}>
                      <Button variant="outline" size="sm" className="transition-all duration-300 hover:border-primary">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href={`/models/${character.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 transition-all duration-300 hover:border-primary"
                      >
                        <Cube className="h-4 w-4" />
                        View Model
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3D Model Preview */}
            <Card className="lg:col-span-1 neon-border card-hover-effect">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cube className="h-5 w-5" />
                  3D Model Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[250px] border rounded-lg overflow-hidden">
                  <ModelViewer modelUrl={character.modelUrl} />
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("model")}
                    className="gap-1 transition-all duration-300 hover:border-primary hover:text-primary"
                  >
                    <Cube className="h-4 w-4" />
                    View Full Model
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Summary */}
            <Card className="lg:col-span-1 neon-border card-hover-effect">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Chapter Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[350px] overflow-y-auto">
                <CharacterSummary characterId={character.id} />
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("details")}
                    className="gap-1 transition-all duration-300 hover:border-primary hover:text-primary"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Read Full Chapter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Gallery Preview */}
          {character.images && character.images.length > 0 && (
            <Card className="mt-6 neon-border card-hover-effect">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5" />
                  Image Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {character.images.slice(0, 5).map((image) => (
                    <div key={image.id} className="relative aspect-square group rounded-lg overflow-hidden">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.caption || character.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {image.caption && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-end transition-opacity duration-200">
                          <p className="text-white p-2 text-sm truncate">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {character.images.length > 5 && (
                    <div
                      className="relative aspect-square flex items-center justify-center bg-muted/50 rounded-lg cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors duration-300"
                      onClick={() => setActiveTab("gallery")}
                    >
                      <div className="text-center">
                        <p className="text-2xl font-bold">+{character.images.length - 5}</p>
                        <p className="text-sm text-muted-foreground">More images</p>
                      </div>
                    </div>
                  )}
                </div>
                {character.images.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("gallery")}
                      className="gap-1 transition-all duration-300 hover:border-primary hover:text-primary"
                    >
                      <ImageIcon className="h-4 w-4" />
                      View All Images
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents Preview */}
          {character.documents && character.documents.length > 0 && (
            <Card className="mt-6 neon-border card-hover-effect">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {character.documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="transition-all duration-300 hover:border-primary hover:text-primary"
                      >
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                  {character.documents.length > 3 && (
                    <div className="text-center mt-2">
                      <p className="text-sm text-muted-foreground">+{character.documents.length - 3} more documents</p>
                    </div>
                  )}
                </div>
                {character.documents.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("documents")}
                      className="gap-1 transition-all duration-300 hover:border-primary hover:text-primary"
                    >
                      <FileText className="h-4 w-4" />
                      View All Documents
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gallery">
          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {character.images && character.images.length > 0 ? (
                <ImageGallery images={character.images} characterName={character.name} />
              ) : (
                <div className="text-center p-12">
                  <DragonAscii size="small" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cube className="h-5 w-5" />
                3D Model Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <ModelViewer modelUrl={character.modelUrl} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {character.documents && character.documents.length > 0 ? (
                <div className="space-y-4">
                  {character.documents.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden card-hover-effect">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="transition-all duration-300 hover:border-primary hover:text-primary"
                          >
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              View Document
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <DragonAscii size="small" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Full Chapter Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: character.chapterText }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
