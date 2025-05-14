"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (url: string) => void
  initialImage?: string
}

export function ImageUploader({ onUpload, initialImage = "" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        // Immediately pass the preview URL to the parent component
        // This ensures we don't wait for the "Upload" button
        onUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadLogic = async () => {
    if (!imageFile) return
    setIsUploading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (previewUrl && !previewUrl.includes('placeholder.svg')) {
        onUpload(previewUrl)
      }
      console.log(`Image uploaded successfully!`)
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
    <div className="grid gap-4">
      {previewUrl ? (
        <div className="relative aspect-square w-full max-w-md mx-auto border rounded-lg overflow-hidden">
          <Image src={previewUrl} alt="Preview" fill className="object-contain" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30 dark:bg-muted/10 aspect-square max-w-md mx-auto">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="text-center mb-4">
            <h3 className="font-medium">Upload Image</h3>
            <p className="text-sm text-muted-foreground">Drag and drop your image, or click to browse</p>
          </div>
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="image-file" className="sr-only">
              Choose an image
            </Label>
            <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      )}

      {imageFile && (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{imageFile.name}</span>
            <span className="text-xs text-muted-foreground">({Math.round(imageFile.size / 1024)} KB)</span>
          </div>
          <Button onClick={onUploadHandler} disabled={isUploading} className="gap-2">
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  )
}
