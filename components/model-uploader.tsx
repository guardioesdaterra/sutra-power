"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CuboidIcon as Cube } from "lucide-react"

interface ModelUploaderProps {
  onUpload: (url: string) => void
  initialModel?: string
}

export function ModelUploader({ onUpload, initialModel = "" }: ModelUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [currentModel, setCurrentModel] = useState<string>("")
  const [uploadError, setUploadError] = useState<string>("")

  useEffect(() => {
    if (initialModel) {
      setCurrentModel(initialModel)
    }
  }, [initialModel])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFile(file)
      setUploadError("")
    }
  }

  const handleUploadLogic = async () => {
    if (!modelFile) return
    setIsUploading(true)
    setUploadError("")
    try {
      const validExtensions = [".glb", ".gltf"]
      const fileExtension = modelFile.name.substring(modelFile.name.lastIndexOf(".")).toLowerCase()
      if (!validExtensions.includes(fileExtension)) {
        throw new Error("Invalid file type. Only .glb or .gltf files are supported.")
      }

      const formData = new FormData();
      formData.append("modelFile", modelFile);

      const response = await fetch('/api/upload-model', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let serverMessage = "File upload failed. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            serverMessage = errorData.message;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_parseError) {
          serverMessage = response.statusText ?? serverMessage;
        }
        throw new Error(serverMessage);
      }

      const result = await response.json();
      
      if (result.success && result.filePath) {
        setCurrentModel(result.filePath)
        onUpload(result.filePath)
        console.log(`Model "${modelFile.name}" uploaded successfully to ${result.filePath}!`)
      } else {
        throw new Error(result.message ?? "Upload succeeded but no filepath was returned.");
      }

    } catch (error) {
      console.error("Error uploading model:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload model")
    } finally {
      setIsUploading(false)
    }
  }

  const onUploadHandler = () => {
    void handleUploadLogic();
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
            <Button variant="outline" size="sm" onClick={() => { setModelFile(null); setCurrentModel(""); setUploadError("");}} className="text-xs">
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
            
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
          </div>

          {modelFile && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Cube className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{modelFile.name}</span>
                <span className="text-xs text-muted-foreground">({modelFile.size > 0 ? Math.round(modelFile.size / 1024) : 0} KB)</span>
              </div>
              <Button onClick={onUploadHandler} disabled={isUploading} className="gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Use Model"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
