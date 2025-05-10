"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, ArrowLeft } from "lucide-react"
import { ModelUploader } from "@/components/model-uploader"
import { ImageUploader } from "@/components/image-uploader"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ImageGallery } from "@/components/image-gallery"
import { DocumentUploader } from "@/components/document-uploader"
import { ModelViewer } from "@/components/model-viewer"
import {
  getCharacter,
  updateCharacter,
  addCharacterImage,
  removeCharacterImage,
  addCharacterDocument,
  removeCharacterDocument,
} from "@/lib/data"

export default function EditCharacterPage({ params }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [character, setCharacter] = useState({
    id: 0,
    name: "",
    description: "",
    imageUrl: "",
    images: [],
    modelUrl: "",
    chapterText: "",
    documents: [],
  })

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setCharacter((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url) => {
    setCharacter((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleModelUpload = (url) => {
    setCharacter((prev) => ({ ...prev, modelUrl: url }))
  }

  const handleChapterTextChange = (content) => {
    setCharacter((prev) => ({ ...prev, chapterText: content }))
  }

  const handleAddImage = async (image) => {
    try {
      const updatedCharacter = await addCharacterImage(character.id, image)
      setCharacter(updatedCharacter)
    } catch (error) {
      console.error("Error adding image:", error)
      alert("Failed to add image. Please try again.")
    }
  }

  const handleRemoveImage = async (imageId) => {
    try {
      const updatedCharacter = await removeCharacterImage(character.id, imageId)
      setCharacter(updatedCharacter)
    } catch (error) {
      console.error("Error removing image:", error)
      alert("Failed to remove image. Please try again.")
    }
  }

  const handleUpdateImageCaption = async (imageId, caption) => {
    try {
      const updatedImages = character.images.map((img) => (img.id === imageId ? { ...img, caption } : img))

      const updatedCharacter = await updateCharacter(character.id, { images: updatedImages })
      setCharacter(updatedCharacter)
    } catch (error) {
      console.error("Error updating image caption:", error)
      alert("Failed to update image caption. Please try again.")
    }
  }

  const handleAddDocument = async (document) => {
    try {
      const updatedCharacter = await addCharacterDocument(character.id, document)
      setCharacter(updatedCharacter)
    } catch (error) {
      console.error("Error adding document:", error)
      alert("Failed to add document. Please try again.")
    }
  }

  const handleRemoveDocument = async (documentId) => {
    try {
      const updatedCharacter = await removeCharacterDocument(character.id, documentId)
      setCharacter(updatedCharacter)
    } catch (error) {
      console.error("Error removing document:", error)
      alert("Failed to remove document. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateCharacter(character.id, character)
      alert("Character updated successfully!")
      router.push(`/characters/${character.id}`)
    } catch (error) {
      console.error("Error updating character:", error)
      alert("Failed to update character. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading character data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href={`/characters/${character.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Character
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-3xl font-bold tracking-tight">Edit {character.name}</h1>
          <p className="text-muted-foreground">
            Update the character's information, images, 3D model, and chapter text.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="model">3D Model</TabsTrigger>
            <TabsTrigger value="chapter">Chapter Text</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Character Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={character.name}
                    onChange={handleChange}
                    placeholder="Enter character name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={character.description}
                    onChange={handleChange}
                    placeholder="Enter character description"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="main-image">Main Image</Label>
                  <ImageUploader onUpload={handleImageUpload} initialImage={character.imageUrl} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Character Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={character.images}
                  onAddImage={handleAddImage}
                  onRemoveImage={handleRemoveImage}
                  onUpdateCaption={handleUpdateImageCaption}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-full h-[400px] border rounded-lg overflow-hidden">
                  <ModelViewer modelUrl={character.modelUrl} />
                </div>
                <ModelUploader onUpload={handleModelUpload} initialModel={character.modelUrl} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chapter Text</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor onChange={handleChapterTextChange} initialValue={character.chapterText} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUploader
                  documents={character.documents || []}
                  onAddDocument={handleAddDocument}
                  onRemoveDocument={handleRemoveDocument}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button type="submit" size="lg" className="gap-2" disabled={isSaving}>
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
