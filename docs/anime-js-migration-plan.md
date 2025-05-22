# Migration Plan: framer-motion to anime.js

## Overview

This document outlines the comprehensive plan to migrate the `SutraOrbitalDualMenu` component from using `framer-motion` to `anime.js` for animations. This migration aims to improve performance and animation fluidity in the orbital menu component.

**References:**
- [anime.js GitHub](https://github.com/juliangarnier/anime)
- [anime.js Website](https://animejs.com/)
- [anime.js Documentation](https://animejs.com/documentation/)

## Phase 1: Setup and Basic Structure

1. **Install anime.js**
   ```bash
   pnpm add animejs
   ```

2. **Update imports**
   - Remove: `import { motion } from "framer-motion";`
   - Add: `import anime from 'animejs/lib/anime.es.js';`
   - Add TypeScript type: `import type { AnimeInstance, AnimeParams } from 'animejs';`

3. **Convert motion components to standard HTML elements**
   - Replace all `<motion.div>` with `<div>` 
   - Replace all `</motion.div>` with `</div>`
   - Remove framer-motion specific props: `initial`, `animate`, `transition`, `whileHover`, etc.

4. **Setup refs for animation targets**
   ```tsx
   // For orbital characters (in array since they're mapped)
   const characterItemRefs = useRef<(HTMLDivElement | null)[]>([]);
   
   // For orbital chapters
   const chapterItemRefs = useRef<(HTMLDivElement | null)[]>([]);
   
   // For other animatable elements
   const bgDustRef = useRef<HTMLDivElement>(null);
   const centralSunRef = useRef<HTMLDivElement>(null);
   const detailPanelRef = useRef<HTMLDivElement>(null);
   ```

5. **Assign refs to elements**
   - For mapped elements, use callback refs:
     ```tsx
     // Inside character map
     ref={(el) => (characterItemRefs.current[index] = el)}
     
     // Inside chapter map
     ref={(el) => (chapterItemRefs.current[index] = el)}
     ```
   - For single elements, use standard ref attribute:
     ```tsx
     ref={bgDustRef}
     ```

## Phase 2: Animating Orbital Items (Core Logic)

1. **Initial state** 
   - Set initial opacity directly in inline style: `style={{ opacity: 0, ... }}`

2. **Positional animations (character orbit)**
   ```tsx
   useEffect(() => {
     if (!characters.length) return;
     
     // Reset refs array if needed (since characters might have changed)
     characterItemRefs.current = characterItemRefs.current.slice(0, characters.length);
     
     characters.forEach((char, index) => {
       const targetEl = characterItemRefs.current[index];
       const pos = characterPositions[index];
       if (!targetEl || !pos) return;
       
       anime.remove(targetEl); // Clear any running animations
       
       anime({
         targets: targetEl,
         translateX: pos.x,
         translateY: pos.y,
         scale: activeCharacter?.id === char.id ? 1.3 : pos.scale,
         opacity: (activeCharacter && activeCharacter.id !== char.id) ? 0.3 : pos.opacity,
         duration: 800,
         easing: 'spring(1, 170, 26, 0)', // mass, stiffness, damping, velocity - tune this!
       });
     });
   }, [characters, characterPositions, activeCharacter]);
   ```

3. **Same for chapter orbit animations**
   - Create a similar useEffect for chapters using chapterPositions and chapterItemRefs

## Phase 3: Auto-Rotation Animation

**Option A: Keep using React state (simpler approach)**
- Continue using the existing requestAnimationFrame logic
- The orbital item animations will be triggered by state changes

**Option B: Pure anime.js rotation (potentially more performant)**
```tsx
// Create a JavaScript object to animate
const orbitRotations = { char: 0, chap: 0 };

useEffect(() => {
  if (!autoRotate) return;
  
  // Animate character rotation
  const charRotationAnim = anime({
    targets: orbitRotations,
    char: [0, 360], // Full rotation
    loop: true,
    duration: (360 / 0.05) * (1000 / 60), // Match speed to original
    easing: 'linear',
    update: () => {
      setRotationAngleCharacter(orbitRotations.char % 360);
    }
  });
  
  // Similar animation for chapter rotation (opposite direction)
  const chapRotationAnim = anime({
    targets: orbitRotations,
    chap: [0, -360], // Negative for opposite direction
    loop: true,
    duration: (360 / 0.08) * (1000 / 60), // Match speed to original
    easing: 'linear',
    update: () => {
      setRotationAngleChapter(orbitRotations.chap % 360);
    }
  });
  
  // Cleanup
  return () => {
    anime.remove(orbitRotations);
  };
}, [autoRotate]);
```

## Phase 4: Click Interactions (Centering Items)

1. **Update click handlers**
   ```tsx
   const handleCharacterClick = (charItem: OrbitalCharacterItem, e: React.MouseEvent) => {
     e.stopPropagation();
     setActiveCharacter(charItem);
     setActiveChapter(null);
     setAutoRotate(false);
     
     // Center the clicked character
     const charIndex = characters.findIndex(c => c.id === charItem.id);
     if (characters.length > 0) {
       const targetAngle = (charIndex / characters.length) * 360;
       // Option A: Direct state update
       setRotationAngleCharacter(270 - targetAngle);
       
       // Option B: Animate to the target angle
       /*
       anime({
         targets: orbitRotations,
         char: 270 - targetAngle,
         duration: 600,
         easing: 'easeOutExpo',
         update: () => setRotationAngleCharacter(orbitRotations.char)
       });
       */
     }
   };
   ```

2. **Apply similar updates to chapter click handler**

## Phase 5: Hover Effects

1. **Replace framer-motion whileHover**
   ```tsx
   // Add these functions to the component
   const handleItemHoverStart = (targetElement: HTMLElement, isActive: boolean) => {
     if (!targetElement || isActive) return;
     
     anime.remove(targetElement);
     anime({
       targets: targetElement,
       scale: 1.2,
       duration: 300,
       easing: 'easeOutQuad'
     });
   };
   
   const handleItemHoverEnd = (targetElement: HTMLElement, isActive: boolean) => {
     if (!targetElement || isActive) return;
     
     anime.remove(targetElement);
     anime({
       targets: targetElement,
       scale: 1,
       duration: 300,
       easing: 'easeOutQuad'
     });
   };
   ```

2. **Apply hover event handlers to elements**
   ```tsx
   // In the JSX for character/chapter items
   onMouseEnter={() => handleItemHoverStart(nodeRef.current, isActive)}
   onMouseLeave={() => handleItemHoverEnd(nodeRef.current, isActive)}
   ```

3. **Note on Box Shadows**
   - Consider using CSS transitions for box-shadow effects
   - Alternatively, investigate anime.js plugins for more complex property animations

## Phase 6: Background and Detail Panel Animations

1. **Animate looping background elements**
   ```tsx
   useEffect(() => {
     if (!bgDustRef.current) return;
     
     anime({
       targets: bgDustRef.current,
       opacity: [0.1, 0.25, 0.1],
       duration: 20000,
       easing: 'easeInOutSine',
       loop: true
     });
     
     // Cleanup
     return () => {
       if (bgDustRef.current) anime.remove(bgDustRef.current);
     };
   }, []);
   ```

2. **Animate central sun element**
   ```tsx
   useEffect(() => {
     if (!centralSunRef.current) return;
     
     anime({
       targets: centralSunRef.current,
       scale: [1, 1.05, 1],
       opacity: [0.8, 1, 0.8],
       duration: 3000,
       easing: 'easeInOutQuad',
       loop: true
     });
     
     // Cleanup
     return () => {
       if (centralSunRef.current) anime.remove(centralSunRef.current);
     };
   }, []);
   ```

3. **Detail panel entry/exit animations**
   ```tsx
   useEffect(() => {
     if (!detailPanelRef.current) return;
     
     if (activeCharacter || activeChapter) {
       // Panel should be visible - entry animation
       anime({
         targets: detailPanelRef.current,
         translateX: [50, 0],
         opacity: [0, 1],
         duration: 600,
         easing: 'easeOutExpo'
       });
     } else {
       // Panel should be hidden - exit animation
       anime({
         targets: detailPanelRef.current,
         translateX: [0, 50],
         opacity: [1, 0],
         duration: 600,
         easing: 'easeOutExpo',
         complete: () => {
           // Optionally set display: none after animation completes
           if (detailPanelRef.current) {
             detailPanelRef.current.style.display = 'none';
           }
         }
       });
     }
   }, [activeCharacter, activeChapter]);
   ```

## Phase 7: Cleanup and Testing

1. **Remove all framer-motion specific code**
   - Delete all remaining framer-motion props
   - Ensure all animations are properly managed by anime.js

2. **Performance optimization**
   - Ensure `will-change: 'transform, opacity'` is applied to all animated elements
   - Consider reducing animations on low-end devices
   - Profile with Chrome DevTools to identify any bottlenecks

3. **Cleanup animation instances**
   - Make sure all animations are properly stopped when unmounting
   - Use anime.remove() in useEffect cleanup functions

4. **Testing**
   - Test all interactions
   - Test on different devices and screen sizes
   - Compare performance with the framer-motion version

## Migration Challenges

1. **Declarative vs Imperative APIs**
   - framer-motion uses a declarative approach (props like `animate`)
   - anime.js uses an imperative approach (function calls)
   - Solution: Use useEffect to trigger animations based on state changes

2. **Hover and Gesture Handling**
   - framer-motion provides convenient `whileHover` props
   - anime.js requires manual event setup
   - Solution: Add appropriate event handlers and anime calls

3. **Enter/Exit Animations**
   - framer-motion's AnimatePresence handles mounting/unmounting 
   - anime.js requires manual management
   - Solution: Control visibility with state and use anime callbacks

4. **Spring Physics**
   - Tuning spring parameters in anime.js to match framer-motion feel
   - Solution: Experiment with `spring(mass, stiffness, damping, velocity)` settings

## Final Notes

- Migration should be done incrementally, testing each phase
- Keep a backup of the framer-motion version for comparison
- Some animations might require creative solutions
- Performance benefits may vary - profile before and after

---

*This migration plan was created based on anime.js v4 and framer-motion v10.* 