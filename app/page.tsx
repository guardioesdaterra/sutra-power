import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, BookOpen, CuboidIcon as Cube, Users, Sparkles } from "lucide-react"
import { DragonAscii } from "@/components/dragon-ascii"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-6 floating">
            <DragonAscii size="medium" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Buddhist Sutra & AR Character Integration
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Organize, visualize, and develop the connection between ancient Buddhist wisdom and modern 3D characters.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/characters">
              <Button size="lg" className="gap-2 glow-button">
                <Sparkles className="h-5 w-5" />
                Explore Characters
              </Button>
            </Link>
            <Link href="/models">
              <Button variant="outline" size="lg" className="gap-2">
                <Cube className="h-5 w-5" />
                View 3D Models
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-amber-50/10 to-amber-100/5 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200/20 dark:border-amber-800/30 neon-border card-hover-effect overflow-hidden">
            <CardContent className="pt-6 p-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-amber-500 dark:text-amber-400 mb-4 pulse" />
                <h2 className="text-2xl font-semibold mb-2">54 Characters</h2>
                <p className="text-muted-foreground mb-6">
                  Organize and manage all 54 characters from the ancient Buddhist Sutra.
                </p>
                <Link href="/characters" className="mt-auto">
                  <Button
                    variant="outline"
                    className="border-amber-500/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100/10 dark:hover:bg-amber-900/30 transition-all duration-300"
                  >
                    View Characters
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50/10 to-emerald-100/5 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/20 dark:border-emerald-800/30 neon-border card-hover-effect overflow-hidden">
            <CardContent className="pt-6 p-6">
              <div className="flex flex-col items-center text-center">
                <Cube className="h-12 w-12 text-emerald-500 dark:text-emerald-400 mb-4 pulse" />
                <h2 className="text-2xl font-semibold mb-2">3D Models</h2>
                <p className="text-muted-foreground mb-6">
                  Interactive 3D model viewer for each character using Google's technology.
                </p>
                <Link href="/models" className="mt-auto">
                  <Button
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/10 dark:hover:bg-emerald-900/30 transition-all duration-300"
                  >
                    Explore Models
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/10 to-purple-100/5 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/20 dark:border-purple-800/30 neon-border card-hover-effect overflow-hidden">
            <CardContent className="pt-6 p-6">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-4 pulse" />
                <h2 className="text-2xl font-semibold mb-2">Sutra Chapters</h2>
                <p className="text-muted-foreground mb-6">
                  Manage and edit the text of each chapter related to the characters.
                </p>
                <Link href="/chapters" className="mt-auto">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-700 dark:text-purple-400 hover:bg-purple-100/10 dark:hover:bg-purple-900/30 transition-all duration-300"
                  >
                    Read Chapters
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href="/characters/new">
            <Button size="lg" className="gap-2 glow-button">
              <PlusCircle className="h-5 w-5" />
              Add New Character
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
