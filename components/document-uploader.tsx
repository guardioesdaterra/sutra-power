"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, File, Trash2, FileUp, FilePlus2 } from "lucide-react"
import type { CharacterDocument } from "@/lib/data"

interface DocumentUploaderProps {
  documents: CharacterDocument[]
  onAddDocument: (document: Omit<CharacterDocument, "id">) => void
  onRemoveDocument: (documentId: string) => void
}

export function DocumentUploader({ documents, onAddDocument, onRemoveDocument }: DocumentUploaderProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [textContent, setTextContent] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocumentFile(file)
      if (!documentName) {
        setDocumentName(file.name.split(".")[0])
      }
    }
  }

  const handleUploadPdfLogic = async () => {
    if (!documentFile) return
    setIsUploading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const fakeUrl = `/uploads/documents/${documentFile.name}`
      onAddDocument({
        url: fakeUrl,
        name: documentName || documentFile.name,
        type: "pdf",
      })
      setDocumentFile(null)
      setDocumentName("")
    } catch (error) {
      console.error("Error uploading document:", error)
      alert("Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const onUploadPdfHandler = () => {
    void handleUploadPdfLogic();
  }

  const handleSaveTextLogic = () => {
    if (!textContent) return
    setIsUploading(true)
    try {
      const textBlob = new Blob([textContent], { type: "text/plain" })
      const textUrl = URL.createObjectURL(textBlob)
      onAddDocument({
        url: textUrl,
        name: documentName || "Chapter Text",
        type: "text",
      })
      setTextContent("")
      setDocumentName("")
    } catch (error) {
      console.error("Error saving text:", error)
      alert("Failed to save text. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const onSaveTextHandler = () => {
    handleSaveTextLogic();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Documents</h3>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {doc.type === "pdf" ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveDocument(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg bg-muted/30 dark:bg-muted/10">
            <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FilePlus2 className="h-4 w-4" />
              Add Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="document-file">PDF File</Label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 dark:bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <div className="text-center mb-4">
                  <h3 className="font-medium">Upload PDF Document</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop your PDF file, or click to browse</p>
                </div>
                <Input id="document-file" type="file" accept=".pdf" onChange={handleFileChange} />
              </div>
            </div>

            {documentFile && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{documentFile.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(documentFile.size / 1024)} KB)</span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={onUploadPdfHandler} disabled={isUploading || !documentFile} className="gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="text" className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="text-name">Document Name</Label>
              <Input
                id="text-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="text-content">Text Content</Label>
              <textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter the chapter text here..."
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={onSaveTextHandler} disabled={isUploading || !textContent} className="gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Saving..." : "Save Text"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
