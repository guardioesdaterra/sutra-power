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

export const DOCK_WIDTH = "w-16" // Renamed from SIDEBAR_WIDTH, still 4rem or 64px

export function MainNav() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div 
      className={`fixed top-1/2 left-4 -translate-y-1/2 ${DOCK_WIDTH} z-50 flex flex-col items-center bg-neutral-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-3`}
    >
      <motion.nav 
        className="flex flex-col items-center gap-3"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      >
        {navItems.map((item, index) => {
          const isActive = item.activeCheck ? item.activeCheck(pathname) : pathname === item.href
          return (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <motion.div
                onHoverStart={() => setHoveredItem(item.label)}
                onHoverEnd={() => setHoveredItem(null)}
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={`w-10 h-10 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-110 ${isActive ? 'bg-primary/90 text-primary-foreground shadow-lg' : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700/80'}`}
                  aria-label={item.label}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-200 ${hoveredItem === item.label ? 'scale-110' : 'scale-100'}`} />
                </Button>
                {hoveredItem === item.label && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap pointer-events-none z-[60]"
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>
      <div className="mt-4 pt-3 border-t border-neutral-700/50 w-full flex items-center justify-center">
        <ModeToggle />
      </div>
    </div>
  );
}
