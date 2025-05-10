import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, Edit, Eye } from "lucide-react"
import { getCharacters } from "@/lib/data"

export default async function CharactersPage() {
  // Get characters from our data source
  const characters = await getCharacters()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
          <p className="text-muted-foreground">Manage and organize all 54 characters from the Buddhist Sutra.</p>
        </div>
        <Link href="/characters/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Character
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <Card key={character.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={character.imageUrl || "/placeholder.svg"}
                alt={character.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{character.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Link href={`/characters/${character.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/characters/${character.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
