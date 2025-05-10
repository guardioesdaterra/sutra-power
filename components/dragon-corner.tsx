import { DragonAscii } from "./dragon-ascii"

interface DragonCornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: "small" | "medium"
}

export function DragonCorner({ position, size = "small" }: DragonCornerProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-10 opacity-30 pointer-events-none`}>
      <DragonAscii size={size} />
    </div>
  )
}
