"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { BookOpen, ArrowRight } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; 
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
const MAX_CHARACTERS_DESKTOP = 54
const MAX_CHARACTERS_MOBILE = 27
const MAX_CHAPTERS_DESKTOP = 27
const MAX_CHAPTERS_MOBILE = 13

// Renamed component to reflect its new structure
export function SutraOrbitalDualMenu() { 
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
    async function fetchData() {
      setLoading(true);
      try {
        const [charactersData, chaptersData] = await Promise.all([
          getCharacters(),
          getChapters(),
        ]);
        
        setCharacters(
          charactersData.slice(0, dimensions.maxCharacters).map((char): OrbitalCharacterItem => ({
            id: char.id,
            name: char.name, // Name kept for data, not display
            imageUrl: getMainImageUrl(char),
            originalData: char,
          }))
        );

        // Use dimensions.maxChapters for slicing
        setChapters(
          chaptersData.slice(0, dimensions.maxChapters).map((chap): OrbitalChapterItem => ({
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
    
    void fetchData();
  }, [dimensions.maxChapters, dimensions.maxCharacters]);

  useEffect(() => {
    let animationFrameId: number;
    if (autoRotate) {
      const rotate = () => {
        setRotationAngleCharacter((prev) => (prev + 0.03) % 360); // Slower
        setRotationAngleChapter((prev) => (prev - 0.05) % 360); // Slower and opposite
        animationFrameId = requestAnimationFrame(rotate);
      };
      animationFrameId = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate]);

  const calculatePosition = (
    index: number,
    total: number,
    radius: number,
    currentRotation: number
  ) => {
    if (total === 0) return { x: 0, y: 0, scale: 1, zIndex: 1, angleDeg: 0 };
    const angleDeg = (index / total) * 360 + currentRotation;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    
    const perspectiveFactor = (Math.sin(angleRad) + 1) / 2; // New: Range 0 to 1 for more depth
    const scale = 0.4 + 0.6 * perspectiveFactor; // New: More noticeable scaling (0.4 to 1)
    const zIndex = Math.round(1 + perspectiveFactor * 10);
    const opacity = 0.3 + 0.7 * perspectiveFactor; // New: More noticeable opacity change (0.3 to 1)

    return { x, y, scale, zIndex, angleDeg, opacity };
  };
  
  const handleCharacterClick = (charItem: OrbitalCharacterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCharacter(charItem);
    setActiveChapter(null); 
    setAutoRotate(false); 
    // Center the clicked character - calculate the required rotation offset
    const charIndex = characters.findIndex(c => c.id === charItem.id);
    if (characters.length > 0) {
      const targetAngle = (charIndex / characters.length) * 360;
      // Set rotation so this item is at the 'front' (e.g., 270 degrees if front is at the top)
      setRotationAngleCharacter(270 - targetAngle);
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
        setRotationAngleChapter(270 - targetAngle);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('/assets/cosmic-dust.png')`, backgroundSize: 'cover'}}
        animate={{ opacity: [0.1, 0.25, 0.1]}} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div 
        className="absolute w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[150px] -translate-x-1/4 -translate-y-1/4"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3]}} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div 
        className="absolute w-1/3 h-1/3 bg-sky-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"
        animate={{ scale: [1, 0.9, 1], opacity: [0.2, 0.4, 0.2]}} 
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut"}}
      />

      {/* Central Sun/Core Element */}
      <motion.div 
        className="absolute w-24 h-24 rounded-full bg-gradient-radial from-sky-300/60 via-sky-400/30 to-transparent shadow-2xl shadow-sky-400/50 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Outer Orbit: Characters */}
      <motion.div className="absolute">
        {characters.map((char, index) => {
          const { x, y, scale, zIndex, opacity } = characterPositions[index];
          const isActive = activeCharacter?.id === char.id;
            return (
            <motion.div
              key={`char-${char.id}`}
              className="absolute flex flex-col items-center justify-center cursor-pointer group"
                  style={{
                width: dimensions.charNodeSize, // Use dynamic size
                height: dimensions.charNodeSize, // Use dynamic size
                left: `calc(50% - ${dimensions.charNodeSize / 2}px)`,
                top: `calc(50% - ${dimensions.charNodeSize / 2}px)`,
                zIndex: isActive ? 100 : zIndex, 
              }}
              initial={{ x, y, scale, opacity: 0 }}
              animate={{ x, y, scale: isActive ? 1.3 : scale, opacity: (activeCharacter && !isActive) ? 0.3 : opacity }}
              transition={{ type: "spring", stiffness: 100, damping: 26 }} // Adjusted spring for characters
              onClick={(e) => handleCharacterClick(char, e)}
            >
              <Link href={`/characters/${char.id}`} passHref legacyBehavior>
                <a onClick={(e) => e.stopPropagation()} className="flex flex-col items-center text-center no-underline group">
                  <motion.div 
                    className={`rounded-full overflow-hidden border-2 shadow-lg transition-all duration-300 ${isActive ? 'border-sky-300 shadow-sky-300/70 ring-4 ring-sky-400/40 scale-110' : 'border-sky-600/70 group-hover:border-sky-400 group-hover:shadow-sky-500/40 group-hover:scale-105'}`}
                    style={{ width: dimensions.charNodeSize * 0.8, height: dimensions.charNodeSize * 0.8 }} // Image container responsive
                    whileHover={{ scale: isActive ? 1.1 : 1.20, boxShadow: isActive ? '0 0 30px rgba(125, 211, 252, 0.8)' : '0 0 20px rgba(56, 189, 248, 0.6)'}}
                  >
                    <Image
                      src={char.imageUrl}
                      alt={char.name} // Alt text still uses name
                      width={Math.round(dimensions.charNodeSize * 0.8)} // Responsive image
                      height={Math.round(dimensions.charNodeSize * 0.8)} // Responsive image
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </a>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Inner Orbit: Chapters */}
      <motion.div className="absolute">
        {chapters.map((chap, index) => {
          const { x, y, scale, zIndex, opacity } = chapterPositions[index];
          const isActive = activeChapter?.id === chap.id;
                              return (
            <motion.div
              key={`chap-${chap.id}`}
              className="absolute flex flex-col items-center justify-center cursor-pointer group"
              style={{
                width: dimensions.chapNodeSize, // Use dynamic size
                height: dimensions.chapNodeSize, // Use dynamic size
                left: `calc(50% - ${dimensions.chapNodeSize / 2}px)`,
                top: `calc(50% - ${dimensions.chapNodeSize / 2}px)`,
                zIndex: isActive ? 90 : zIndex + 20, 
              }}
              initial={{ x, y, scale, opacity: 0 }}
              animate={{ x, y, scale: isActive ? 1.2 : scale, opacity: (activeChapter && !isActive) ? 0.4 : opacity }}
              transition={{ type: "spring", stiffness: 100, damping: 26 }} // Adjusted spring for chapters
              onClick={(e) => handleChapterClick(chap, e)}
              onHoverStart={() => !activeChapter && setHoveredChapterBrief(chap.brief) }
              onHoverEnd={() => setHoveredChapterBrief(null)}
            >
              <motion.div 
                className={`rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${isActive ? 'bg-teal-400 border-2 border-teal-100 shadow-teal-200/60 ring-4 ring-teal-300/40 scale-110' : 'bg-teal-600/80 group-hover:bg-teal-500 border-2 border-teal-400/70 group-hover:border-teal-300 group-hover:shadow-teal-500/40 group-hover:scale-105'}`}
                style={{ width: dimensions.chapNodeSize * 0.7, height: dimensions.chapNodeSize * 0.7 }} // Icon container responsive
                whileHover={{ scale: isActive ? 1.1 : 1.2 }}
              >
                <BookOpen className={`w-3/5 h-3/5 ${isActive ? 'text-white' : 'text-teal-100'}`} /> {/* Relative icon size */}
              </motion.div>
              {scale > 0.65 && ( 
                 <span 
                   className={`mt-1.5 text-[9px] md:text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-teal-50' : 'text-teal-200/80 group-hover:text-teal-50'}`}>
                  {chap.title.replace("Chapter ", "C")}
                </span>
              )}
            </motion.div>
                              );
                            })}
      </motion.div>
      
      {/* Chapter Brief Display on Hover (only if no chapter is active) */}
      {hoveredChapterBrief && !activeChapter && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 bg-slate-800/90 text-slate-200 rounded-lg shadow-2xl max-w-lg text-xs z-[150] backdrop-blur-md border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <h4 className="font-bold mb-1.5 text-teal-300 text-sm">Chapter Glimpse</h4>
          <p className="text-slate-300 leading-relaxed hyphens-auto text-xs" lang="en">{hoveredChapterBrief}</p>
        </motion.div>
      )}

       {/* Active Item Detail Panel */}
       {(activeCharacter ?? activeChapter) && (
        <motion.div
          className="fixed top-1/2 right-4 md:right-6 -translate-y-1/2 p-4 md:p-6 bg-slate-800/80 text-white rounded-xl shadow-2xl w-[90%] max-w-md md:w-96 max-h-[85vh] md:max-h-[90vh] overflow-y-auto z-[120] backdrop-blur-lg border border-slate-700/80 ring-1 ring-black/5" // Responsive width and padding
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 150, damping: 25, duration: 0.3 }}
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
              <motion.div 
                className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-sky-400/80 shadow-xl shadow-sky-400/40 ring-4 ring-sky-400/30"
                initial={{scale: 0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay:0.1, duration: 0.3, ease: "easeOut"}}
              >
                 <Image src={activeCharacter.imageUrl} alt={activeCharacter.name} width={128} height={128} className="object-cover w-full h-full" />
              </motion.div>
              <h3 className="text-2xl font-bold text-sky-200 mb-2">{activeCharacter.name}</h3>
              <p className="text-sm text-slate-300 mb-4 max-h-32 overflow-y-auto px-2 text-left hyphens-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50" lang="en">
                {activeCharacter.originalData.description}
              </p>
              <Link href={`/characters/${activeCharacter.id}`} passHref legacyBehavior>
                 <motion.a 
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                    whileHover={{letterSpacing: "0.5px"}}
                 >
                   Explore Character <ArrowRight className="w-4 h-4 ml-2" />
                 </motion.a>
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
        </motion.div>
      )}
    </div>
  );
}

export default SutraOrbitalDualMenu; // Exporting with the new name 