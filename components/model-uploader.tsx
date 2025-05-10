"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CuboidIcon as Cube } from "lucide-react"

export function ModelUploader({ onUpload, initialModel = "" }) {
  const [isUploading, setIsUploading] = useState(false)
  const [modelFile, setModelFile] = useState(null)
  const [currentModel, setCurrentModel] = useState("")

  useEffect(() => {
    if (initialModel) {
      setCurrentModel(initialModel)
    }
  }, [initialModel])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setModelFile(file)
    }
  }

  const handleUpload = async () => {
    if (!modelFile) return

    setIsUploading(true)

    try {
      // This would normally upload to a storage service
      // For this example, we're just simulating the upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a successful upload with a fake URL
      const fakeModelUrl = `/uploads/models/${modelFile.name}`
      setCurrentModel(fakeModelUrl)
      onUpload(fakeModelUrl)

      // Success message
      alert(`Model "${modelFile.name}" uploaded successfully!`)
    } catch (error) {
      console.error("Error uploading model:", error)
      alert("Failed to upload model. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-4">
      {currentModel ? (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cube className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Current Model</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentModel("")} className="text-xs">
              Change Model
            </Button>
          </div>
          <div className="bg-muted/30 dark:bg-muted/10 p-4 rounded-lg text-center">
            <p className="text-sm break-all">{currentModel}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30 dark:bg-muted/10">
            <Cube className="h-10 w-10 text-muted-foreground mb-4" />
            <div className="text-center mb-4">
              <h3 className="font-medium">Upload 3D Model</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your .glb or .gltf file, or click to browse</p>
            </div>
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="model-file" className="sr-only">
                Choose a model file
              </Label>
              <Input id="model-file" type="file" accept=".glb,.gltf" onChange={handleFileChange} />
            </div>
          </div>

          {modelFile && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Cube className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{modelFile.name}</span>
                <span className="text-xs text-muted-foreground">({Math.round(modelFile.size / 1024)} KB)</span>
              </div>
              <Button onClick={handleUpload} disabled={isUploading} className="gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
