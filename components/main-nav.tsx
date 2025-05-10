"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, CuboidIcon as Cube, Home, Users, Menu, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useState, useEffect } from "react"
import { DragonAscii } from "./dragon-ascii"

export function MainNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 dragon-border ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="hidden md:block">
              <DragonAscii size="small" className="text-primary" />
            </div>
            <span className="text-xl font-bold">Sutra AR</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 md:space-x-2">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={`h-9 gap-1 transition-all duration-300 ${
                  pathname === "/" ? "glow-button" : "hover:text-primary"
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link href="/characters">
              <Button
                variant={pathname.startsWith("/characters") ? "default" : "ghost"}
                size="sm"
                className={`h-9 gap-1 transition-all duration-300 ${
                  pathname.startsWith("/characters") ? "glow-button" : "hover:text-primary"
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Characters</span>
              </Button>
            </Link>
            <Link href="/models">
              <Button
                variant={pathname.startsWith("/models") ? "default" : "ghost"}
                size="sm"
                className={`h-9 gap-1 transition-all duration-300 ${
                  pathname.startsWith("/models") ? "glow-button" : "hover:text-primary"
                }`}
              >
                <Cube className="h-4 w-4" />
                <span className="hidden md:inline">3D Models</span>
              </Button>
            </Link>
            <Link href="/chapters">
              <Button
                variant={pathname.startsWith("/chapters") ? "default" : "ghost"}
                size="sm"
                className={`h-9 gap-1 transition-all duration-300 ${
                  pathname.startsWith("/chapters") ? "glow-button" : "hover:text-primary"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden md:inline">Chapters</span>
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant={pathname === "/" ? "default" : "ghost"} className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/characters" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={pathname.startsWith("/characters") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Characters
              </Button>
            </Link>
            <Link href="/models" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant={pathname.startsWith("/models") ? "default" : "ghost"} className="w-full justify-start">
                <Cube className="h-4 w-4 mr-2" />
                3D Models
              </Button>
            </Link>
            <Link href="/chapters" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant={pathname.startsWith("/chapters") ? "default" : "ghost"} className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Chapters
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
