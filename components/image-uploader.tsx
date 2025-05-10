"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon } from "lucide-react"

export function ImageUploader({ onUpload, initialImage = "" }) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

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
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a successful upload with the preview URL
      onUpload(previewUrl)

      // Success message
      alert(`Image "${imageFile.name}" uploaded successfully!`)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-4">
      {previewUrl ? (
        <div className="relative aspect-square w-full max-w-md mx-auto border rounded-lg overflow-hidden">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
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
          <Button onClick={handleUpload} disabled={isUploading} className="gap-2">
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}
    </div>
  )
}
