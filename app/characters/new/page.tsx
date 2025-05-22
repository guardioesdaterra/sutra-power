"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, CuboidIcon as Cube, ImageIcon, Save, ArrowLeft } from "lucide-react"
import { ModelUploader } from "@/components/model-uploader"
import { ImageGallery } from "@/components/image-gallery"
import { createCharacter, Character, CharacterImage } from "@/lib/data"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function NewCharacterPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [character, setCharacter] = useState<Omit<Character, "id">>({
    name: "",
    description: "",
    imageUrl: "",
    modelUrl: "/assets/3d/duck.glb", // Default model
    chapterText: "",
    images: [],
    documents: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCharacter((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddImage = (image: Omit<CharacterImage, "id">) => {
    // Generate a temporary numeric ID (negative to avoid conflicts with DB IDs)
    const newImage: CharacterImage = {
      id: -Math.floor(Math.random() * 1000000), // Use negative numbers for temp IDs
      ...image
    }
    
    setCharacter((prev) => ({
      ...prev,
      imageUrl: image.url, // Set as main image
      images: [...prev.images, newImage]
    }))
  }
  
  const handleRemoveImageLogic = async (imageId: number): Promise<void> => {
    const updatedImages = character.images.filter(img => img.id !== imageId)
    const wasMainImage = character.images.find(img => img.id === imageId)?.url === character.imageUrl
    let newMainImage = character.imageUrl
    if (wasMainImage) {
      newMainImage = updatedImages.length > 0 ? updatedImages[0].url : ""
    }
    setCharacter(prev => ({
      ...prev,
      imageUrl: newMainImage,
      images: updatedImages
    }))
    await Promise.resolve(); 
  }
  
  const handleUpdateImageCaption = (imageId: number, caption: string) => {
    const updatedImages = character.images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    )
    
    setCharacter(prev => ({
      ...prev,
      images: updatedImages
    }))
  }
  
  const handleSetMainImage = (url: string) => {
    setCharacter(prev => ({ ...prev, imageUrl: url }))
  }

  const handleModelUpload = (url: string) => {
    setCharacter((prev) => ({ ...prev, modelUrl: url }))
  }

  const handleChapterTextChange = (content: string) => {
    setCharacter((prev) => ({ ...prev, chapterText: content }))
  }

  const handleSubmitLogic = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setIsSaving(true)
    
    try {
      const newCharacter = await createCharacter(character)
      alert("Character created successfully!")
      router.push(`/characters/${newCharacter.id}`)
    } catch (error) {
      console.error("Error creating character:", error)
      alert("Failed to create character. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmitLogic();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/characters" legacyBehavior>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Characters
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-3xl font-bold tracking-tight">Add New Character</h1>
          <p className="text-muted-foreground">Create a new character with image, 3D model, and chapter text.</p>
        </div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <Card className="mb-8">
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Character Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery 
                images={character.images}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImageLogic}
                onUpdateCaption={handleUpdateImageCaption}
                onSetMainImage={handleSetMainImage}
                mainImageUrl={character.imageUrl}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cube className="h-5 w-5" />
                3D Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModelUploader onUpload={handleModelUpload} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Chapter Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor onChange={handleChapterTextChange} />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2" disabled={isSaving}>
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Character"}
          </Button>
        </div>
      </form>
    </div>
  );
}
