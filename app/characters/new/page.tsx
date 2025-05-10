"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, CuboidIcon as Cube, ImageIcon, Save, ArrowLeft } from "lucide-react"
import { ModelUploader } from "@/components/model-uploader"
import { ImageUploader } from "@/components/image-uploader"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function NewCharacterPage() {
  const [character, setCharacter] = useState({
    name: "",
    description: "",
    imageUrl: "",
    modelUrl: "",
    chapterText: "",
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // This would normally save to a database
    console.log("Saving character:", character)
    // Redirect to characters page after saving
    window.location.href = "/characters"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/characters">
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

      <form onSubmit={handleSubmit}>
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
                Character Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader onUpload={handleImageUpload} />
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
          <Button type="submit" size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Save Character
          </Button>
        </div>
      </form>
    </div>
  )
}
