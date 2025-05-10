"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

export function RichTextEditor({ onChange, initialValue = "" }) {
  const [content, setContent] = useState(initialValue)
  const [view, setView] = useState("edit")

  useEffect(() => {
    if (initialValue && initialValue !== content) {
      setContent(initialValue)
    }
  }, [initialValue])

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange(newContent)
  }

  const insertTag = (openTag, closeTag) => {
    const textarea = document.getElementById("editor-textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end)

    setContent(newContent)
    onChange(newContent)

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + openTag.length, end + openTag.length)
    }, 0)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
        <Button variant="ghost" size="sm" onClick={() => insertTag("<h1>", "</h1>")} className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertTag("<h2>", "</h2>")} className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertTag("<h3>", "</h3>")} className="h-8 w-8 p-0">
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={() => insertTag("<strong>", "</strong>")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertTag("<em>", "</em>")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertTag("<u>", "</u>")} className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertTag("<ol>\n  <li>", "</li>\n</ol>")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertTag('<div style="text-align: left;">', "</div>")}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertTag('<div style="text-align: center;">', "</div>")}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertTag('<div style="text-align: right;">', "</div>")}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="bg-muted border-b px-4">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger value="edit" className="data-[state=active]:bg-background">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            id="editor-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter chapter text here..."
            className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className="min-h-[300px] p-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
