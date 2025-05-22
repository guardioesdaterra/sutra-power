import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen, Eye } from "lucide-react"
import { getChapters } from "@/lib/data"

export default async function ChaptersPage() {
  // Get chapters from our data source
  const chapters = await getChapters()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sutra Chapters</h1>
          <p className="text-muted-foreground">Browse and edit the 54 chapters of the ancient Buddhist Sutra.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12 h-12 flex-shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{chapter.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{chapter.content}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
              <Link href={`/chapters/${chapter.id}`} legacyBehavior>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/characters/${chapter.characterId}`} legacyBehavior>
                <Button variant="outline" size="sm" className="gap-1">
                  View Related Character
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
