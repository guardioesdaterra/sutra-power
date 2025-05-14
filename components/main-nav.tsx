"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, CuboidIcon as Cube, Home, Users, LucideIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  activeCheck?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home, activeCheck: (pn) => pn === "/" },
  { href: "/characters", label: "Characters", icon: Users, activeCheck: (pn) => pn.startsWith("/characters") },
  { href: "/models", label: "3D Models", icon: Cube, activeCheck: (pn) => pn.startsWith("/models") },
  { href: "/chapters", label: "Chapters", icon: BookOpen, activeCheck: (pn) => pn.startsWith("/chapters") },
]

export function MainNav() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full px-4">
      <motion.nav 
        className="flex items-center gap-1 p-1.5 bg-neutral-800/60 backdrop-blur-lg rounded-xl shadow-2xl border border-neutral-700/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
      >
        {navItems.map((item) => {
          const isActive = item.activeCheck ? item.activeCheck(pathname) : pathname === item.href
          return (
            <Link key={item.href} href={item.href} passHref>
              <motion.div
                onHoverStart={() => setHoveredItem(item.label)}
                onHoverEnd={() => setHoveredItem(null)}
                className="relative"
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={`w-11 h-11 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-110 ${isActive ? 'bg-primary/80 text-primary-foreground shadow-md' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700/70'}`}
                  aria-label={item.label}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-200 ${hoveredItem === item.label ? 'scale-110' : 'scale-100'}`} />
                </Button>
                {hoveredItem === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap pointer-events-none"
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
            </Link>
          )
        })}
        <div className="ml-1 border-l border-neutral-700/50 pl-2 flex items-center">
          <ModeToggle />
        </div>
      </motion.nav>
    </div>
  )
}
