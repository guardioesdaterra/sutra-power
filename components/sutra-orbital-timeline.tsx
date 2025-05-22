"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { BookOpen, ArrowRight } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import anime from 'animejs/lib/anime.es.js';
import { Character, Chapter, getCharacters, getChapters, getMainImageUrl } from "@/lib/data";
import { Button } from "@/components/ui/button"; // Added Button for panel close

interface OrbitalCharacterItem {
  id: number;
  name: string;
  imageUrl: string;
  originalData: Character;
}

interface OrbitalChapterItem {
  id: number;
  title: string;
  brief: string;
  originalData: Chapter;
}

const ORBIT_RADIUS_CHARACTER = 330;
const ORBIT_RADIUS_CHAPTER = 200;
const NODE_SIZE_CHARACTER = 80;
const NODE_SIZE_CHAPTER = 55;
const MAX_CHARACTERS_DESKTOP = 20;
const MAX_CHARACTERS_MOBILE = 15;
const MAX_CHAPTERS_DESKTOP = 10;
const MAX_CHAPTERS_MOBILE = 7;

// Renamed component to reflect its new structure
export function SutraOrbitalDualMenu() { 
  const [allCharacters, setAllCharacters] = useState<OrbitalCharacterItem[]>([]);
  const [allChapters, setAllChapters] = useState<OrbitalChapterItem[]>([]);
  
  const [characters, setCharacters] = useState<OrbitalCharacterItem[]>([]);
  const [chapters, setChapters] = useState<OrbitalChapterItem[]>([]);
  
  const [activeCharacter, setActiveCharacter] = useState<OrbitalCharacterItem | null>(null);
  const [activeChapter, setActiveChapter] = useState<OrbitalChapterItem | null>(null);
  const [hoveredChapterBrief, setHoveredChapterBrief] = useState<string | null>(null);

  const [rotationAngleCharacter, setRotationAngleCharacter] = useState<number>(0);
  const [rotationAngleChapter, setRotationAngleChapter] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for anime.js animations
  const characterItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgDustRef = useRef<HTMLDivElement>(null);
  const centralSunRef = useRef<HTMLDivElement>(null);
  // Object for orbital rotations animation - will be used in anime.js
  const orbitRotations = useRef({ char: 0, chap: 0 });

  const [dimensions, setDimensions] = useState({
    charRadius: ORBIT_RADIUS_CHARACTER,
    chapRadius: ORBIT_RADIUS_CHAPTER,
    charNodeSize: NODE_SIZE_CHARACTER,
    chapNodeSize: NODE_SIZE_CHAPTER,
    maxCharacters: MAX_CHARACTERS_DESKTOP,
    maxChapters: MAX_CHAPTERS_DESKTOP,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile
        setDimensions({
          charRadius: ORBIT_RADIUS_CHARACTER * 0.6,
          chapRadius: ORBIT_RADIUS_CHAPTER * 0.6,
          charNodeSize: NODE_SIZE_CHARACTER * 0.75,
          chapNodeSize: NODE_SIZE_CHAPTER * 0.75,
          maxCharacters: MAX_CHARACTERS_MOBILE,
          maxChapters: MAX_CHAPTERS_MOBILE,
        });
      } else { // Desktop
        setDimensions({
          charRadius: ORBIT_RADIUS_CHARACTER,
          chapRadius: ORBIT_RADIUS_CHAPTER,
          charNodeSize: NODE_SIZE_CHARACTER,
          chapNodeSize: NODE_SIZE_CHAPTER,
          maxCharacters: MAX_CHARACTERS_DESKTOP,
          maxChapters: MAX_CHAPTERS_DESKTOP,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const [charactersData, chaptersData] = await Promise.all([
          getCharacters(),
          getChapters(),
        ]);
        
        setAllCharacters(
          charactersData.map((char): OrbitalCharacterItem => ({
            id: char.id,
            name: char.name,
            imageUrl: getMainImageUrl(char),
            originalData: char,
          }))
        );

        setAllChapters(
          chaptersData.map((chap): OrbitalChapterItem => ({
            id: chap.id,
            title: `Chapter ${chap.id}`,
            brief: chap.content.substring(0, 150) + "...",
            originalData: chap,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data for orbital menus:", error);
        setLoading(false);
      }
    }
    
    void fetchAllData();
  }, []);

  useEffect(() => {
    if (allCharacters.length > 0) {
      setCharacters(allCharacters.slice(0, dimensions.maxCharacters));
    }
    if (allChapters.length > 0) {
      setChapters(allChapters.slice(0, dimensions.maxChapters));
    }
  }, [allCharacters, allChapters, dimensions.maxCharacters, dimensions.maxChapters]);

  const calculatePosition = (
    index: number,
    total: number,
    radius: number,
    currentRotation: number
  ) => {
    if (total === 0) return { x: 0, y: 0, scale: 1, zIndex: 1, angleDeg: 0, opacity: 1 };
    const angleDeg = (index / total) * 360 + currentRotation;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    
    const perspectiveFactor = (Math.sin(angleRad) + 1) / 2; // Range 0 to 1 for more depth
    const scale = 0.35 + 0.65 * perspectiveFactor; // Adjusted: More noticeable scaling (0.35 to 1)
    const zIndex = Math.round(1 + perspectiveFactor * 10);
    const opacity = 0.25 + 0.75 * perspectiveFactor; // Adjusted: More noticeable opacity change (0.25 to 1)

    return { x, y, scale, zIndex, angleDeg, opacity };
  };

  // Pre-calculate positions for memoization
  const characterPositions = useMemo(() => 
    characters.map((_, index) => 
      calculatePosition(index, characters.length, dimensions.charRadius, rotationAngleCharacter)
    ), [characters, rotationAngleCharacter, dimensions.charRadius]
  );

  const chapterPositions = useMemo(() => 
    chapters.map((_, index) => 
      calculatePosition(index, chapters.length, dimensions.chapRadius, rotationAngleChapter)
    ), [chapters, rotationAngleChapter, dimensions.chapRadius]
  );

  // Animate character positions based on state changes
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
        easing: 'spring(1, 170, 26, 0)', // mass, stiffness, damping, velocity
      });
    });
  }, [characters, characterPositions, activeCharacter]);

  // Animate chapter positions based on state changes
  useEffect(() => {
    if (!chapters.length) return;
    
    // Reset refs array if needed
    chapterItemRefs.current = chapterItemRefs.current.slice(0, chapters.length);
    
    chapters.forEach((chap, index) => {
      const targetEl = chapterItemRefs.current[index];
      const pos = chapterPositions[index];
      if (!targetEl || !pos) return;
      
      anime.remove(targetEl); // Clear any running animations
      
      anime({
        targets: targetEl,
        translateX: pos.x,
        translateY: pos.y,
        scale: activeChapter?.id === chap.id ? 1.2 : pos.scale,
        opacity: (activeChapter && activeChapter.id !== chap.id) ? 0.4 : pos.opacity,
        duration: 800,
        easing: 'spring(1, 170, 26, 0)', // mass, stiffness, damping, velocity
      });
    });
  }, [chapters, chapterPositions, activeChapter]);

  // Auto-rotation using anime.js
  useEffect(() => {
    if (!autoRotate) return;
    
    // Animate character rotation
    const charRotationAnim = anime({
      targets: orbitRotations.current,
      char: '+=360', // Use relative value for continuous rotation
      loop: true,
      duration: 20000, 
      easing: 'linear',
      update: () => {
        console.log('Updating char rotation:', orbitRotations.current.char);
        setRotationAngleCharacter(orbitRotations.current.char % 360);
      }
    });
    
    // Animate chapter rotation (opposite direction)
    const chapRotationAnim = anime({
      targets: orbitRotations.current,
      chap: '-=360', // Use relative value for continuous rotation (opposite direction)
      loop: true,
      duration: 15000, 
      easing: 'linear',
      update: () => {
        console.log('Updating chap rotation:', orbitRotations.current.chap);
        setRotationAngleChapter(orbitRotations.current.chap % 360);
      }
    });
    
    // Cleanup
    return () => {
      anime.remove(orbitRotations.current);
    };
  }, [autoRotate]);

  // Background dust animation
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
  
  // Central sun animation
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

  // Detail panel animation
  useEffect(() => {
    const detailPanel = document.getElementById('detail-panel');
    if (!detailPanel) return;
    
    if (activeCharacter || activeChapter) {
      // Panel should be visible - entry animation
      anime({
        targets: detailPanel,
        translateX: [50, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
      });
    } else {
      // Panel should be hidden - exit animation
      anime({
        targets: detailPanel,
        translateX: [0, 50],
        opacity: [1, 0],
        duration: 600,
        easing: 'easeOutExpo',
        complete: () => {
          // Optionally set display none after animation completes
          if (detailPanel) {
            detailPanel.style.display = 'none';
          }
        }
      });
    }
  }, [activeCharacter, activeChapter]);

  // Character brief animation
  useEffect(() => {
    if (hoveredChapterBrief && !activeChapter) {
      const chapterBrief = document.getElementById('chapter-brief-display');
      if (chapterBrief) {
        anime.remove(chapterBrief);
        anime({
          targets: chapterBrief,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 200,
          easing: 'easeInOutQuad'
        });
      }
    }
  }, [hoveredChapterBrief, activeChapter]);
  
  // Character image animation
  useEffect(() => {
    if (activeCharacter) {
      const characterImage = document.getElementById('character-image');
      if (characterImage) {
        anime.remove(characterImage);
        anime({
          targets: characterImage,
          scale: [0.5, 1],
          opacity: [0, 1],
          duration: 400,
          delay: 200,
          easing: 'easeOutQuad'
        });
      }
    }
  }, [activeCharacter]);
  
  // Loading animation
  useEffect(() => {
    if (loading) {
      const loadingSpinner = document.getElementById('loading-spinner');
      if (loadingSpinner) {
        anime.remove(loadingSpinner);
        anime({
          targets: loadingSpinner,
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          duration: 2000,
          loop: true,
          easing: "easeInOutQuad"
        });
      }
    }
  }, [loading]);

  const handleCharacterClick = (charItem: OrbitalCharacterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCharacter(charItem);
    setActiveChapter(null); 
    setAutoRotate(false); 
    
    // Center the clicked character
    const charIndex = characters.findIndex(c => c.id === charItem.id);
    if (characters.length > 0) {
      const targetAngle = (charIndex / characters.length) * 360;
      
      // Animate to the target angle
      anime.remove(orbitRotations.current);
      anime({
        targets: orbitRotations.current,
        char: 270 - targetAngle,
        duration: 600,
        easing: 'easeOutExpo',
        update: () => setRotationAngleCharacter(orbitRotations.current.char)
      });
    }
  };

  const handleChapterClick = (chapItem: OrbitalChapterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveChapter(chapItem);
    // Optionally keep activeCharacter or clear it
    // setActiveCharacter(null); 
    setAutoRotate(false); 
    
    const chapIndex = chapters.findIndex(c => c.id === chapItem.id);
    if (chapters.length > 0) {
      const targetAngle = (chapIndex / chapters.length) * 360;
      
      // Animate to the target angle
      anime.remove(orbitRotations.current);
      anime({
        targets: orbitRotations.current,
        chap: 270 - targetAngle,
        duration: 600,
        easing: 'easeOutExpo',
        update: () => setRotationAngleChapter(orbitRotations.current.chap)
      });
    }
  };
  
  const handleContainerClick = () => {
    setActiveCharacter(null);
    setActiveChapter(null);
    setHoveredChapterBrief(null);
    setAutoRotate(true);
  };

  const closeDetailPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCharacter(null);
    setActiveChapter(null);
    setAutoRotate(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="flex flex-col items-center">
          <div 
            id="loading-spinner"
            className="w-20 h-20 border-[6px] border-t-sky-400 border-l-sky-500 border-r-indigo-400 border-b-indigo-500 rounded-full mb-6 shadow-2xl shadow-sky-500/30"
          />
          <p className="text-2xl font-display tracking-wider">Weaving the Cosmic Threads...</p>
          <p className="text-sm text-slate-400 mt-1">Sutra Cosmos is awakening.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-950 to-indigo-950 cursor-default select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Background elements for depth */}
      <div 
        ref={bgDustRef}
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('/assets/cosmic-dust.png')`, backgroundSize: 'cover'}}
      />
      <div 
        ref={el => {
          if (el) {
            anime.remove(el);
            anime({
              targets: el,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
              duration: 15000,
              easing: 'easeInOutSine',
              loop: true
            });
          }
        }}
        className="absolute w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[150px] -translate-x-1/4 -translate-y-1/4"
      />
      <div 
        ref={el => {
          if (el) {
            anime.remove(el);
            anime({
              targets: el,
              scale: [1, 0.9, 1],
              opacity: [0.2, 0.4, 0.2],
              duration: 18000,
              easing: 'easeInOutSine',
              loop: true
            });
          }
        }}
        className="absolute w-1/3 h-1/3 bg-sky-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"
      />
      {/* Central Sun/Core Element */}
      <div 
        ref={centralSunRef}
        className="absolute w-24 h-24 rounded-full bg-gradient-radial from-sky-300/60 via-sky-400/30 to-transparent shadow-2xl shadow-sky-400/50 flex items-center justify-center"
      >
        <div 
          ref={el => {
            if (el) {
              anime.remove(el);
              anime({
                targets: el,
                rotate: 360,
                duration: 20000,
                loop: true,
                easing: 'linear'
              });
            }
          }}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
        />
      </div>
      {/* Outer Orbit: Characters */}
      <div className="absolute">
        {characters.map((char, index) => {
          const { x, y, scale, zIndex, opacity } = characterPositions[index];
          const isActive = activeCharacter?.id === char.id;
            return (
              <div
                key={`char-${char.id}`}
                ref={(el) => { 
                  if (el) characterItemRefs.current[index] = el; 
                  else {
                    // Clean up or null out the ref when component unmounts
                    const currentRefs = [...characterItemRefs.current];
                    currentRefs[index] = null;
                    characterItemRefs.current = currentRefs;
                  }
                }}
                className="absolute flex flex-col items-center justify-center cursor-pointer group"
                style={{
                  width: dimensions.charNodeSize, // Use dynamic size
                  height: dimensions.charNodeSize, // Use dynamic size
                  left: `calc(50% - ${dimensions.charNodeSize / 2}px)`,
                  top: `calc(50% - ${dimensions.charNodeSize / 2}px)`,
                  zIndex: isActive ? 100 : zIndex,
                  willChange: 'transform, opacity', // Added will-change
                  opacity: 0 // Initial state for anime.js
                }}
                onClick={(e) => handleCharacterClick(char, e)}
              >
                <Link
                  href={`/characters/${char.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center text-center no-underline group"
                  legacyBehavior>
                  <div 
                    className={`rounded-full overflow-hidden border-2 shadow-lg transition-all duration-300 ${isActive ? 'border-sky-300 shadow-sky-300/70 ring-4 ring-sky-400/40 scale-110' : 'border-sky-600/70 group-hover:border-sky-400 group-hover:shadow-sky-500/40 group-hover:scale-105'}`}
                    style={{ width: dimensions.charNodeSize * 0.8, height: dimensions.charNodeSize * 0.8 }} // Image container responsive
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        anime.remove(e.currentTarget);
                        anime({
                          targets: e.currentTarget,
                          scale: 1.25,
                          boxShadow: '0 0 25px rgba(56, 189, 248, 0.7)',
                          duration: 400,
                          easing: 'spring(1, 150, 18, 0)'
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        anime.remove(e.currentTarget);
                        anime({
                          targets: e.currentTarget,
                          scale: 1,
                          boxShadow: '0 0 0px rgba(56, 189, 248, 0)',
                          duration: 300,
                          easing: 'easeOutQuad'
                        });
                      }
                    }}
                  >
                    <Image
                      src={char.imageUrl}
                      alt={char.name} // Alt text still uses name
                      width={Math.round(dimensions.charNodeSize * 0.8)} // Responsive image
                      height={Math.round(dimensions.charNodeSize * 0.8)} // Responsive image
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>
              </div>
            );
        })}
      </div>
      {/* Inner Orbit: Chapters */}
      <div className="absolute">
        {chapters.map((chap, index) => {
          const { x, y, scale, zIndex, opacity } = chapterPositions[index];
          const isActive = activeChapter?.id === chap.id;
          return (
            <div
              key={`chap-${chap.id}`}
              ref={(el) => { 
                if (el) chapterItemRefs.current[index] = el; 
                else {
                  // Clean up or null out the ref when component unmounts
                  const currentRefs = [...chapterItemRefs.current];
                  currentRefs[index] = null;
                  chapterItemRefs.current = currentRefs;
                }
              }}
              className="absolute flex flex-col items-center justify-center cursor-pointer group"
              style={{
                width: dimensions.chapNodeSize, // Use dynamic size
                height: dimensions.chapNodeSize, // Use dynamic size
                left: `calc(50% - ${dimensions.chapNodeSize / 2}px)`,
                top: `calc(50% - ${dimensions.chapNodeSize / 2}px)`,
                zIndex: isActive ? 90 : zIndex + 20,
                willChange: 'transform, opacity', // Added will-change
                opacity: 0 // Initial state for anime.js
              }}
              onClick={(e) => handleChapterClick(chap, e)}
              onMouseEnter={() => !activeChapter && setHoveredChapterBrief(chap.brief) }
              onMouseLeave={() => setHoveredChapterBrief(null)}
            >
              <div 
                className={`rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${isActive ? 'bg-teal-400 border-2 border-teal-100 shadow-teal-200/60 ring-4 ring-teal-300/40 scale-110' : 'bg-teal-600/80 group-hover:bg-teal-500 border-2 border-teal-400/70 group-hover:border-teal-300 group-hover:shadow-teal-500/40 group-hover:scale-105'}`}
                style={{ width: dimensions.chapNodeSize * 0.7, height: dimensions.chapNodeSize * 0.7 }} // Icon container responsive
                onMouseEnter={(e) => {
                  if (!isActive) {
                    anime.remove(e.currentTarget);
                    anime({
                      targets: e.currentTarget,
                      scale: 1.25,
                      boxShadow: '0 0 25px rgba(56, 189, 248, 0.7)',
                      duration: 400,
                      easing: 'spring(1, 150, 18, 0)'
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    anime.remove(e.currentTarget);
                    anime({
                      targets: e.currentTarget,
                      scale: 1,
                      boxShadow: '0 0 0px rgba(56, 189, 248, 0)',
                      duration: 300,
                      easing: 'easeOutQuad'
                    });
                  }
                }}
              >
                <BookOpen className={`w-3/5 h-3/5 ${isActive ? 'text-white' : 'text-teal-100'}`} /> {/* Relative icon size */}
              </div>
              {scale > 0.65 && ( 
                 <span 
                   className={`mt-1.5 text-[9px] md:text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-teal-50' : 'text-teal-200/80 group-hover:text-teal-50'}`}>
                  {chap.title.replace("Chapter ", "C")}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Chapter Brief Display on Hover (only if no chapter is active) */}
      {hoveredChapterBrief && !activeChapter && (
        <div
          id="chapter-brief-display"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 bg-slate-800/90 text-slate-200 rounded-lg shadow-2xl max-w-lg text-xs z-[150] backdrop-blur-md border border-slate-700"
          style={{ opacity: 0 }} // Initial state for anime.js
        >
          <h4 className="font-bold mb-1.5 text-teal-300 text-sm">Chapter Glimpse</h4>
          <p className="text-slate-300 leading-relaxed hyphens-auto text-xs" lang="en">{hoveredChapterBrief}</p>
        </div>
      )}
      {/* Active Item Detail Panel */}
      {(activeCharacter ?? activeChapter) && (
       <div
         id="detail-panel"
         className="fixed top-1/2 right-4 md:right-6 -translate-y-1/2 p-4 md:p-6 bg-slate-800/80 text-white rounded-xl shadow-2xl w-[90%] max-w-md md:w-96 max-h-[85vh] md:max-h-[90vh] overflow-y-auto z-[120] backdrop-blur-lg border border-slate-700/80 ring-1 ring-black/5" // Responsive width and padding
         style={{ opacity: 0 }} // Initial state for anime.js
         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
       >
         <Button
           variant="ghost" 
           size="icon"
           onClick={closeDetailPanel}
           className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 rounded-full w-8 h-8"
         >
           &times; {/* Simple X icon */}
         </Button>
         {activeCharacter && (
           <div className="flex flex-col items-center text-center">
             <div 
               id="character-image"
               className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-sky-400/80 shadow-xl shadow-sky-400/40 ring-4 ring-sky-400/30"
               style={{ opacity: 0 }} // Initial state for anime.js
             >
                <Image src={activeCharacter.imageUrl} alt={activeCharacter.name} width={128} height={128} className="object-cover w-full h-full" />
             </div>
             <h3 className="text-2xl font-bold text-sky-200 mb-2">{activeCharacter.name}</h3>
             <p className="text-sm text-slate-300 mb-4 max-h-32 overflow-y-auto px-2 text-left hyphens-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50" lang="en">
               {activeCharacter.originalData.description}
             </p>
             <Link
               href={`/characters/${activeCharacter.id}`}
               className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
               onMouseEnter={(e) => {
                 anime.remove(e.currentTarget);
                 anime({
                   targets: e.currentTarget,
                   letterSpacing: "0.5px",
                   duration: 300,
                   easing: 'easeOutQuad'
                 });
               }}
               onMouseLeave={(e) => {
                 anime.remove(e.currentTarget);
                 anime({
                   targets: e.currentTarget,
                   letterSpacing: "0px",
                   duration: 300,
                   easing: 'easeOutQuad'
                 });
               }}
               legacyBehavior>
               Explore Character <ArrowRight className="w-4 h-4 ml-2" />
             </Link>
           </div>
         )}
         {activeChapter && (
           <div className="text-left">
             <h3 className="text-2xl font-bold text-teal-200 mb-3">{activeChapter.title}</h3>
             <div className="prose prose-sm prose-invert max-w-none max-h-[60vh] overflow-y-auto text-slate-300 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 hyphens-auto" lang="en">
               <p>{activeChapter.originalData.content}</p> 
             </div>
           </div>
         )}
       </div>
     )}
    </div>
  );
}

export default SutraOrbitalDualMenu; // Exporting with the new name