"use client";

// import Link from "next/link"; // Removed
// import { Button } from "@/components/ui/button"; // Removed
// import { User, CuboidIcon as Cube, BookOpen, Home } from "lucide-react"; // Removed as menuItems is removed

export function OrbitalNavigation() {
  // const menuItems = [ // Removed
  //   { href: "/", label: "Home", icon: Home },
  //   { href: "/characters", label: "Characters", icon: User },
  //   { href: "/models", label: "3D Models", icon: Cube },
  //   { href: "/chapters", label: "Chapters", icon: BookOpen },
  // ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* isOpen && ( // Removed conditional rendering
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 transition-all duration-300 opacity-100"
          style={{transform: 'translateY(0)'}} // Simplified style, assuming it would be open if rendered
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-black/80 border-white/20 text-white hover:bg-white hover:text-black transition-all"
                >
                  <Icon size={18} />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      ) */}
  
    </div>
  );
}

export default OrbitalNavigation; 