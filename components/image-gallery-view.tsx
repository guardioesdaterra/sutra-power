import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { CharacterImage } from "@/lib/data"

interface ImageGalleryProps {
  images: CharacterImage[]
  characterName: string
}

export function ImageGallery({ images, characterName }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Dialog key={image.id}>
          <DialogTrigger asChild>
            <div
              className="relative aspect-square group cursor-pointer rounded-lg overflow-hidden neon-border"
              style={{
                animationDelay: `${index * 0.1}s`,
                transitionDelay: `${index * 0.05}s`,
              }}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.caption || characterName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-end transition-opacity duration-300">
                  <p className="text-white p-3 text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl" aria-describedby={`image-${image.id}-description`}>
            <div className="relative aspect-square w-full">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.caption || characterName}
                fill
                className="object-contain"
              />
            </div>
            <p id={`image-${image.id}-description`} className="text-center mt-2">
              {image.caption || "No caption available"}
            </p>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
