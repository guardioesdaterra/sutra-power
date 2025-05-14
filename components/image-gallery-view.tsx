import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { CharacterImage } from "@/lib/data"

interface ImageGalleryProps {
  images: CharacterImage[]
  characterName: string
  mainImageUrl?: string
}

export function ImageGallery({ images, characterName, mainImageUrl }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Dialog key={image.id}>
          <DialogTrigger asChild>
            <div
              className={`relative aspect-square group cursor-pointer rounded-lg overflow-hidden ${
                image.url === mainImageUrl ? 'ring-2 ring-primary' : 'neon-border'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                transitionDelay: `${index * 0.05}s`,
              }}
            >
              <Image
                src={image.url && !image.url.includes('placeholder.svg') 
                  ? image.url
                  : `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(characterName)}`
                }
                alt={image.caption ?? characterName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {image.url === mainImageUrl && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
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
                src={image.url && !image.url.includes('placeholder.svg') 
                  ? image.url
                  : `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(characterName)}`
                }
                alt={image.caption ?? characterName}
                fill
                className="object-contain"
              />
            </div>
            <p id={`image-${image.id}-description`} className="text-center mt-2">
              {image.caption ?? "No caption available"}
              {image.url === mainImageUrl && (
                <span className="ml-2 inline-flex items-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Main Image
                </span>
              )}
            </p>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
