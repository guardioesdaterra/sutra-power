"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, X, Check, Star, Upload } from "lucide-react"
import type { CharacterImage } from "@/lib/data"

interface ImageGalleryProps {
  images: CharacterImage[]
  onAddImage: (image: Omit<CharacterImage, "id">) => void
  onRemoveImage: (imageId: number) => Promise<void>
  onUpdateCaption: (imageId: number, caption: string) => void
  onSetMainImage?: (imageUrl: string) => void
  mainImageUrl?: string
}

export function ImageGallery({ 
  images, 
  onAddImage, 
  onRemoveImage, 
  onUpdateCaption,
  onSetMainImage,
  mainImageUrl
}: ImageGalleryProps) {
  const [editingCaption, setEditingCaption] = useState<number | null>(null)
  const [newCaption, setNewCaption] = useState("")
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

  const handleEditCaption = (image: CharacterImage) => {
    if (typeof image.id === 'number') {
      setEditingCaption(image.id)
      setNewCaption(image.caption ?? "")
    }
  }

  const handleSaveCaption = (imageId: number) => {
    onUpdateCaption(imageId, newCaption)
    setEditingCaption(null)
  }

  const handleCancelEdit = () => {
    setEditingCaption(null)
  }
  
  const handleRemoveImageLogic = async (imageId: number) => {
    if (!confirm("Are you sure you want to remove this image? This action cannot be undone.")) {
      return;
    }
    setDeletingImageId(imageId);
    try {
      await onRemoveImage(imageId);
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setDeletingImageId(null);
    }
  }
  
  const onRemoveImageHandler = (imageId: number) => {
    void handleRemoveImageLogic(imageId);
  }
  
  const handleSetMainImage = (image: CharacterImage) => {
    if (onSetMainImage) {
      onSetMainImage(image.url);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className={`overflow-hidden ${image.url === mainImageUrl ? 'ring-2 ring-primary' : ''}`}>
            <div className="aspect-square relative cursor-pointer">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-full">
                    <Image
                      className="rounded-lg object-cover"
                      src={image.url ?? "/assets/default-image.jpg"}
                      alt={image.caption ?? "Character image"}
                      fill
                    />
                    {image.url === mainImageUrl && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1" title="Main image">
                        <Star className="h-4 w-4 text-primary-foreground" fill="currentColor" />
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl" aria-describedby={`image-${image.id}-description`}>
                  <div className="relative aspect-square w-full">
                    <Image
                      className="rounded-lg object-cover"
                      src={image.url ?? "/assets/default-image.jpg"}
                      alt={image.caption ?? "Character image"}
                      fill
                    />
                  </div>
                  <p id={`image-${image.id}-description`} className="text-center mt-2">
                    {image.caption ?? "No caption available"}
                    {image.url === mainImageUrl && (
                      <span className="ml-2 inline-flex items-center text-primary font-semibold">
                        <Star className="h-4 w-4 mr-1" fill="currentColor" /> Main Image
                      </span>
                    )}
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
                  <Button variant="ghost" size="icon" onClick={() => handleSaveCaption(image.id as number)} className="h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">{image.caption ?? "No caption"}</p>
                  <div className="flex gap-1">
                    {onSetMainImage && image.url !== mainImageUrl && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSetMainImage(image)} 
                        className="h-8 w-8 text-amber-500"
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEditCaption(image)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => typeof image.id === 'number' && onRemoveImageHandler(image.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={deletingImageId === image.id}
                    >
                      {deletingImageId === image.id ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-destructive rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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

function ImageUploadCard({ onAddImage }: { onAddImage: (image: Omit<CharacterImage, "id">) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [caption, setCaption] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPreviewUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadLogic = async () => {
    if (!imageFile || !previewUrl) return
    setIsUploading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!previewUrl.includes('/assets/default-image.jpg')) {
        onAddImage({
          url: previewUrl,
          caption: caption,
        })
        setImageFile(null)
        setPreviewUrl("")
        setCaption("")
      } else {
        console.error("Cannot use placeholder as image URL")
        alert("Invalid image. Please select a real image file.")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }
  
  const onUploadHandler = () => {
    void handleUploadLogic();
  }

  return (
    <Card className="overflow-hidden border-dashed">
      <div className="aspect-square relative">
        {previewUrl ? (
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
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
            <Button onClick={onUploadHandler} disabled={isUploading || !imageFile} className="mt-4 w-full gap-2">
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Add Image"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
