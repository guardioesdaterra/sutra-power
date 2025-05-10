interface DragonAsciiProps {
  size?: "small" | "medium" | "large"
  color?: string
  className?: string
}

export function DragonAscii({ size = "medium", color, className = "" }: DragonAsciiProps) {
  // Different dragon ASCII art based on size
  const smallDragon = `
    __,='
  _.-'_/
 /    /
 \\___/
  `

  const mediumDragon = `
            ______________
      ,===:'.,            \`-.
           \`:.             _,-'
             \`:.          \`-..__
               \\:.          \`-..__
                \\:.             \`--..
                 \\:.              \`:-.
                  \\:.              \`---
                   \\:.            _,-'
                    \\:.       _,-'
                     \`._____,-'
  `

  const largeDragon = `
                                                 /\\
                                                /  \\
                                               /    \\
                                              /      \\
                                             /        \\
                                            /          \\
                                           /            \\
                                          /              \\
                                         /                \\
                                        /                  \\
                                       /                    \\
                                      /                      \\
                                     /                        \\
                                    /                          \\
                                   /                            \\
                                  /                              \\
                                 /                                \\
                                /                                  \\
                               /                                    \\
                              /                                      \\
                             /                                        \\
                            /                                          \\
                           /                                            \\
                          /                                              \\
                         /                                                \\
                        /                                                  \\
                       /                                                    \\
                      /                                                      \\
                     /                                                        \\
                    /                                                          \\
                   /                                                            \\
                  /                                                              \\
                 /                                                                \\
                /                                                                  \\
               /                                                                    \\
              /                                                                      \\
             /                                                                        \\
            /                                                                          \\
           /                                                                            \\
          /                                                                              \\
         /                                                                                \\
        /                                                                                  \\
       /                                                                                    \\
      /                                                                                      \\
     /                                                                                        \\
    /                                                                                          \\
   /                                                                                            \\
  /                                                                                              \\
 /                                                                                                \\
/                                                                                                  \\
\\                                                                                                  /
 \\                                                                                                /
  \\                                                                                              /
   \\                                                                                            /
    \\                                                                                          /
     \\                                                                                        /
      \\                                                                                      /
       \\                                                                                    /
        \\                                                                                  /
         \\                                                                                /
          \\                                                                              /
           \\                                                                            /
            \\                                                                          /
             \\                                                                        /
              \\                                                                      /
               \\                                                                    /
                \\                                                                  /
                 \\                                                                /
                  \\                                                              /
                   \\                                                            /
                    \\                                                          /
                     \\                                                        /
                      \\                                                      /
                       \\                                                    /
                        \\                                                  /
                         \\                                                /
                          \\                                              /
                           \\                                            /
                            \\                                          /
                             \\                                        /
                              \\                                      /
                               \\                                    /
                                \\                                  /
                                 \\                                /
                                  \\                              /
                                   \\                            /
                                    \\                          /
                                     \\                        /
                                      \\                      /
                                       \\                    /
                                        \\                  /
                                         \\                /
                                          \\              /
                                           \\            /
                                            \\          /
                                             \\        /
                                              \\      /
                                               \\    /
                                                \\  /
                                                 \\/
  `

  const dragonArt = size === "small" ? smallDragon : size === "large" ? largeDragon : mediumDragon

  const customStyle = color ? { color } : {}

  return (
    <div className={`dragon-ascii ${className}`} style={customStyle}>
      {dragonArt}
    </div>
  )
}
