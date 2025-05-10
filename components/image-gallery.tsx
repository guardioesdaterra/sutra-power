"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, X, Check } from "lucide-react"
import type { CharacterImage } from "@/lib/data"

interface ImageGalleryProps {
  images: CharacterImage[]
  onAddImage: (image: Omit<CharacterImage, "id">) => void
  onRemoveImage: (imageId: string) => void
  onUpdateCaption: (imageId: string, caption: string) => void
}

export function ImageGallery({ images, onAddImage, onRemoveImage, onUpdateCaption }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<CharacterImage | null>(null)
  const [editingCaption, setEditingCaption] = useState<string | null>(null)
  const [newCaption, setNewCaption] = useState("")

  const handleEditCaption = (image: CharacterImage) => {
    setEditingCaption(image.id)
    setNewCaption(image.caption || "")
  }

  const handleSaveCaption = (imageId: string) => {
    onUpdateCaption(imageId, newCaption)
    setEditingCaption(null)
  }

  const handleCancelEdit = () => {
    setEditingCaption(null)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-square relative cursor-pointer">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-full">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.caption || "Character image"}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl" aria-describedby={`image-${image.id}-description`}>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.caption || "Character image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p id={`image-${image.id}-description`} className="text-center mt-2">
                    {image.caption || "No caption available"}
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <CardContent className="p-3">
              {editingCaption === image.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Image caption"
                    className="text-sm"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleSaveCaption(image.id)} className="h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">{image.caption || "No caption"}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCaption(image)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveImage(image.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <ImageUploadCard onAddImage={onAddImage} />
      </div>
    </div>
  )
}

function ImageUploadCard({ onAddImage }) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [caption, setCaption] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!imageFile) return

    setIsUploading(true)

    try {
      // This would normally upload to a storage service
      // For this example, we're just simulating the upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add the new image
      onAddImage({
        url: previewUrl,
        caption: caption,
      })

      // Reset form
      setImageFile(null)
      setPreviewUrl("")
      setCaption("")
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-dashed">
      <div className="aspect-square relative">
        {previewUrl ? (
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 dark:bg-muted/10 p-4">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">Add new image</p>
            <Input type="file" accept="image/*" onChange={handleFileChange} className="mt-4 w-full" />
          </div>
        )}
      </div>
      {previewUrl && (
        <CardContent className="p-3 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setImageFile(null)
                setPreviewUrl("")
                setCaption("")
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Image"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
