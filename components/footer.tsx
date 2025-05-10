import Link from "next/link"
import { DragonAscii } from "./dragon-ascii"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 dragon-border">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <DragonAscii size="small" className="hidden md:block" />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Sutra AR Integration. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            Connecting ancient wisdom with modern technology
          </p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col">
            <h4 className="font-medium text-sm mb-2">Navigation</h4>
            <div className="flex flex-col gap-1">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/characters" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Characters
              </Link>
              <Link href="/models" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                3D Models
              </Link>
              <Link href="/chapters" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Chapters
              </Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="font-medium text-sm mb-2">Information</h4>
            <div className="flex flex-col gap-1">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Help
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
