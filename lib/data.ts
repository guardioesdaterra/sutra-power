// This file contains functions to interact with data storage
// Using Dexie.js (IndexedDB) for data persistence

import { db, Character as DexieCharacter, isIndexedDBSupported, initializeDatabase } from "./db";

export interface CharacterImage {
  id: string
  url: string
  caption?: string
}

export interface CharacterDocument {
  id: string
  url: string
  name: string
  type: "pdf" | "text"
}

export interface Character {
  id: number
  name: string
  description: string
  imageUrl: string
  images: CharacterImage[]
  modelUrl: string
  chapterText: string
  documents: CharacterDocument[]
}

export interface Chapter {
  id: number
  title: string
  content: string
  characterId: number
}

export interface Model {
  id: number
  name: string
  description: string
  modelUrl: string
  characterId: number
}

// Real character names from the provided list
const characterNames: string[] = [
  "Buda Śākyamuni",
  "Samantabhadra",
  "Manjushri",
  "Meghaśrī",
  "Sāgaramegha",
  "Supratiṣṭhita",
  "Megha",
  "Muktaka",
  "Sāgaradhvaja",
  "Āśā",
  "Bhīṣmottaranirghoṣa",
  "Jayoṣmāyatana",
  "Maitrayaṇī",
  "Sudarśana",
  "Indriyeśvara",
  "Samantanetra",
  "Anala",
  "Mahāprabha",
  "Acalā",
  "Sarvagamin",
  "Utpalabhūti",
  "Vaira",
  "Jayottama",
  "Siṃhavijṛmbhitā",
  "Vasumitrā",
  "Veṣṭhila",
  "Avalokiteśvara",
  "Ananyagāmin",
  "Mahādeva",
  "Sthāvarā",
  "Vāsantī",
  "Samantagambhīraśrīvimalaprabhā",
  "Pramuditanayanajagadvirocanā",
  "Samantasattvatrāṇojaḥśrī",
  "Praśantarutasāgaravatī",
  "Sarvanagararakṣāsaṃbhavatejaḥśrī",
  "Sarvavṛkṣpraphullanasukhasaṃvāsā",
  "Sarvajagadrakṣāpraṇidhānavīryaprabhā",
  "Sutejomaṇḍalaratiśrī",
  "Gopā",
  "Māyādevī",
  "Surendrābhā",
  "Viśvāmitra",
  "Śilpābhijña",
  "Bhadrottamā",
  "Muktāsāra",
  "Sucandra",
  "Ajitasena",
  "Śivarāgra",
  "Śrīsaṃbhava & Śrīmati",
  "Maitreya",
  "Manjushri (reprise)",
  "Samantabhadra (reprise)",
]

// Placeholder descriptions for each character
const descriptions: string[] = [
  "The historical Buddha, founder of Buddhism",
  "Bodhisattva of practice and meditation",
  "Bodhisattva of wisdom and intelligence",
  "The Cloud of Glory, representing the vastness of wisdom",
  "The Ocean Cloud, representing the depth of compassion",
  "The Well Established, representing stability in practice",
  "The Cloud, representing the cooling of afflictions",
  "The Liberated One, representing freedom from attachments",
  "The Ocean Banner, representing the vastness of merit",
  "Hope, representing aspiration for enlightenment",
  "The Fearless Thunder, representing courage in practice",
  "The Abode of Victory and Heat, representing spiritual energy",
  "The Friendly One, representing loving-kindness",
  "The Beautiful to Behold, representing the attractiveness of virtue",
  "The Lord of Faculties, representing mastery of the senses",
  "The All-Seeing, representing omniscience",
  "The Fire, representing the burning away of ignorance",
  "The Great Light, representing illumination of the mind",
  "The Immovable, representing steadfastness in practice",
  "The All-Going, representing universal accessibility",
  "The Lotus-Born, representing purity amidst worldly defilements",
  "The Adamantine, representing indestructible wisdom",
  "The Supreme Victory, representing triumph over Mara",
  "The Lion's Roar, representing fearless proclamation of Dharma",
  "The Good Friend, representing spiritual companionship",
  "The Clothed, representing modesty and ethical conduct",
  "The Lord Who Looks Down, representing compassionate observation",
  "The Non-Returning, representing irreversible progress",
  "The Great God, representing divine qualities",
  "The Stable, representing immovability in meditation",
  "The Spring-Like, representing seasonal renewal",
  "The All-Profound-Glory-Stainless-Light, representing purified radiance",
  "The Joyful-Eyed-World-Illuminator, representing joyful vision",
  "The All-Beings-Saving-Splendor-Glory, representing universal salvation",
  "The Peaceful-Voice-Ocean-Like, representing tranquil eloquence",
  "The All-Cities-Protecting-Arising-Splendor-Glory, representing urban protection",
  "The All-Trees-Blooming-Happiness-Dwelling, representing natural harmony",
  "The All-World-Protecting-Vow-Energy-Light, representing protective power",
  "The Good-Light-Mandala-Joy-Glory, representing radiant delight",
  "The Cowherd, representing Buddha's foster mother",
  "The Illusion Goddess, representing Buddha's birth mother",
  "The Splendor of Indra, representing divine majesty",
  "The Universal Friend, representing universal friendship",
  "The Skilled in Crafts, representing artistic mastery",
  "The Supremely Excellent, representing highest quality",
  "The Essence of Liberation, representing the core of freedom",
  "The Good Moon, representing cooling reflection",
  "The Unconquered Army, representing spiritual strength",
  "The Auspicious Passion, representing transformed desire",
  "The Glorious Origin & The Glorious One, representing auspicious partnership",
  "The Loving One, representing future Buddha",
  "The Gentle Glory, representing wisdom revisited",
  "The Universally Good, representing practice revisited",
]

// Generate initial data with the real names
const generateInitialCharacters = (): Character[] => {
  return Array.from({ length: 54 }, (_, i) => {
    // Create more realistic image URLs for main characters
    let imageUrl = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(characterNames[i])}`;
    
    // For primary characters, use sample Buddhist imagery
    if (i < 5) {
      // These are sample image paths that would be used in production
      const sampleImages = [
        "/assets/buddha.jpg",
        "/assets/samantabhadra.jpg", 
        "/assets/manjushri.jpg",
        "/assets/meghashri.jpg",
        "/assets/sagaramegha.jpg"
      ];
      imageUrl = sampleImages[i];
    }
    
    return {
      id: i + 1,
      name: characterNames[i],
      description: descriptions[i] ?? `A character from the ancient Buddhist Sutra`,
      imageUrl: imageUrl,
      images: [
        {
          id: `main-${i + 1}`,
          url: imageUrl,
          caption: `Main image of ${characterNames[i]}`,
        },
        // Add some additional sample images for primary characters
        ...(i < 5 ? [
          {
            id: `alt-${i + 1}`,
            url: `/assets/${characterNames[i].toLowerCase().replace(/\s/g, '-')}-alt.jpg`,
            caption: `Alternative portrayal of ${characterNames[i]}`,
          }
        ] : [])
      ],
      modelUrl: "/assets/astronaut.glb", // Use our local astronaut model
      chapterText: `<h2>Chapter ${i + 1}: The Teachings of ${characterNames[i]}</h2>
        <p>In ancient times, when the Buddha was residing at the Jetavana monastery, ${characterNames[i]} approached and spoke about the nature of wisdom.</p>
        <p>"The path to enlightenment requires diligent practice and deep understanding. One who is mindful observes the rising and falling of phenomena, and through this observation, insight develops."</p>
        <p>${characterNames[i]} continued, "Just as a skilled craftsman can distinguish between different types of wood, a wise person can distinguish between wholesome and unwholesome states of mind."</p>
        <p>This teaching was given to help the disciples develop their understanding of the path to liberation.</p>`,
      documents: [],
    };
  });
}

const generateInitialChapters = (characters: Character[]): Chapter[] => {
  return characters.map((character, i) => ({
    id: i + 1,
    title: `Chapter ${i + 1}: The Teachings of ${character.name}`,
    content: `In ancient times, when the Buddha was residing at the Jetavana monastery, ${character.name} approached and spoke about the nature of wisdom.
      "The path to enlightenment requires diligent practice and deep understanding. One who is mindful observes the rising and falling of phenomena, and through this observation, insight develops."
      ${character.name} continued, "Just as a skilled craftsman can distinguish between different types of wood, a wise person can distinguish between wholesome and unwholesome states of mind."
      This teaching was given to help the disciples develop their understanding of the path to liberation.`,
    characterId: character.id,
  }))
}

const generateInitialModels = (characters: Character[]): Model[] => {
  return characters.map((character, i) => ({
    id: i + 1,
    name: `${character.name} Model`,
    description: "3D model representation of the character",
    modelUrl: character.modelUrl,
    characterId: character.id,
  }))
}

// Data persistence using IndexedDB via Dexie.js
// Initialize data in IndexedDB if it doesn't exist
const initializeData = async () => {
  if (typeof window === "undefined") return

  try {
    // Check if database is supported
    if (!isIndexedDBSupported()) {
      console.warn("IndexedDB is not supported in this browser. Falling back to in-memory data.");
      return;
    }

    // Initialize the database (including migration from localStorage if needed)
    await initializeDatabase();

    // Check if any data exists in the database
    const count = await db.characters.count();
    
    if (count === 0) {
      // If no data, let's populate with initial data
      const initialCharacters = generateInitialCharacters();

      // Map to DexieCharacter format for saving
      const dexieCharactersToSave: DexieCharacter[] = initialCharacters.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        imageUrl: c.imageUrl,
        modelUrl: c.modelUrl,
        story: c.chapterText,
        // 'images' and 'documents' are not part of DexieCharacter, they are stored separately
      }));
      await db.characters.bulkPut(dexieCharactersToSave);

      // Now save images separately
      for (const char of initialCharacters) {
        if (char.images && char.images.length > 0) {
          const imagesToSave = char.images.map(img => ({
            characterId: char.id, // Ensure characterId is linked
            url: img.url,
            caption: img.caption,
          }));
          await db.characterImages.bulkPut(imagesToSave);
        }
      }
      console.log("Database populated with initial data.");
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper function to determine the main image URL consistently across the application
export function getMainImageUrl(character: {
  imageUrl?: string;
  name: string;
  images?: { url: string; caption?: string; }[];
}): string {
  // Use imageUrl if it exists and is not a placeholder
  if (character.imageUrl && !character.imageUrl.includes('placeholder.svg')) {
    return character.imageUrl;
  }
  
  // Otherwise use first non-placeholder image from gallery
  if (character.images && character.images.length > 0) {
    const nonPlaceholder = character.images.find(img => !img.url.includes('placeholder.svg'));
    return nonPlaceholder 
      ? nonPlaceholder.url 
      : character.images[character.images.length - 1].url;
  }
  
  // Otherwise use placeholder
  return `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(character.name)}`;
}

// Convert Dexie character format to our API format
const convertToApiCharacter = (dexieChar: DexieCharacter & { images?: {id?: number | string, url: string, caption?: string}[] }): Character => {
  // Convert all images from the DB, including their IDs
  const images = dexieChar.images?.map(img => ({
    id: img.id?.toString() ?? `img-${Math.random().toString(36).substring(2, 11)}`,
    url: img.url,
    caption: img.caption ?? '',
  })) ?? [];
  
  // Use the helper function to determine the main image URL
  const mainImage = getMainImageUrl({
    imageUrl: dexieChar.imageUrl,
    name: dexieChar.name,
    images: images
  });
  
  // Use the local astronaut model as default
  const modelUrl = dexieChar.modelUrl ?? "/assets/astronaut.glb";
  
  return {
    id: dexieChar.id!,
    name: dexieChar.name,
    description: dexieChar.description,
    imageUrl: mainImage,
    images: images,
    modelUrl: modelUrl,
    chapterText: dexieChar.story ?? '',
    documents: [], // documents not implemented in Dexie schema yet
  };
};

// Get all characters
export async function getCharacters(): Promise<Character[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    return generateInitialCharacters();
  }

  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      // Fallback for browsers without IndexedDB support
      return generateInitialCharacters();
    }
    
    // Get all characters from the database
    const dexieCharacters = await db.characters.toArray();
    
    // For each character, get its images
    const characters: Character[] = [];
    
    for (const char of dexieCharacters) {
      const images = await db.characterImages
        .where('characterId')
        .equals(char.id!)
        .toArray();
      
      characters.push(convertToApiCharacter({...char, images}));
    }
    
    return characters;
  } catch (error) {
    console.error('Error getting characters:', error);
    return [];
  }
}

// Get a specific character
export async function getCharacter(id: number): Promise<Character | undefined> {
  if (typeof window === "undefined") {
    // Server-side: return from initial data
    const characters = generateInitialCharacters();
    return characters.find((char) => char.id === id);
  }
  
  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      // Fallback for browsers without IndexedDB support
      const characters = generateInitialCharacters();
      return characters.find((char) => char.id === id);
    }
    
    // Get character with its images from the database
    const dexieCharacter = await db.getCharacterWithImages(id);
    
    if (!dexieCharacter) return undefined;
    
    return convertToApiCharacter(dexieCharacter);
  } catch (error) {
    console.error(`Error getting character ${id}:`, error);
    return undefined;
  }
}

// Get all chapters
export async function getChapters(): Promise<Chapter[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    const characters = await getCharacters();
    return generateInitialChapters(characters);
  }
  
  try {
    await initializeData();
    
    // For now, we'll generate chapters based on characters
    // In a future iteration, we could add a chapters table to the database
    const characters = await getCharacters();
    return generateInitialChapters(characters);
  } catch (error) {
    console.error('Error getting chapters:', error);
    return [];
  }
}

// Get a specific chapter
export async function getChapter(id: number): Promise<Chapter | undefined> {
  const chapters = await getChapters();
  return chapters.find((chapter) => chapter.id === id);
}

// Get all models
export async function getModels(): Promise<Model[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    const characters = await getCharacters();
    return generateInitialModels(characters);
  }
  
  try {
    await initializeData();
    
    // For now, we'll generate models based on characters
    // In a future iteration, we could add a models table to the database
    const characters = await getCharacters();
    return generateInitialModels(characters);
  } catch (error) {
    console.error('Error getting models:', error);
    return [];
  }
}

// Get a specific model
export async function getModel(id: number): Promise<Model | undefined> {
  const models = await getModels();
  return models.find((model) => model.id === id);
}

// Create a new character
export async function createCharacter(character: Omit<Character, "id">): Promise<Character> {
  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Add the character to the database
    const characterToSave: DexieCharacter = {
      name: character.name,
      description: character.description,
      imageUrl: character.imageUrl,
      modelUrl: character.modelUrl,
      story: character.chapterText,
    };
    
    // Extract images to save separately
    const imagesToSave = character.images?.map(img => ({
      characterId: 0, // Will be updated after we get the character ID
      url: img.url,
      caption: img.caption
    })) || [];
    
    // Save character with its images
    const newId = await db.saveCharacterWithImages({
      ...characterToSave,
      images: imagesToSave
    });
    
    // Return the saved character
    const savedCharacter = await getCharacter(newId);
    
    if (!savedCharacter) {
      throw new Error("Failed to retrieve saved character");
    }
    
    return savedCharacter;
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
}

// Update a character
export async function updateCharacter(id: number, characterUpdate: Partial<Character>): Promise<Character> {
  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Get existing character
    const existingCharacter = await db.getCharacterWithImages(id);
    
    if (!existingCharacter) {
      throw new Error(`Character with ID ${id} not found`);
    }
    
    // Determine which images to use
    const imagesToSave = characterUpdate.images 
      ? characterUpdate.images.map(img => ({
          characterId: id,
          id: img.id ? Number(img.id.toString().replace(/\D/g, "")) || undefined : undefined,
          url: img.url,
          caption: img.caption
        }))
      : existingCharacter.images;
      
    // Determine main image URL with consistent rules
    let imageUrl = characterUpdate.imageUrl;
    
    // If imageUrl is explicitly provided, use that
    if (imageUrl) {
      // Use it as-is - explicit user choice  
    }
    // If no imageUrl is provided but there are images
    else if (!imageUrl && imagesToSave && imagesToSave.length > 0) {
      // First try to use the existing imageUrl if it's still valid
      if (existingCharacter.imageUrl && !existingCharacter.imageUrl.includes('placeholder.svg')) {
        // Make sure the image still exists in the gallery
        const imageStillExists = imagesToSave.some(img => img.url === existingCharacter.imageUrl);
        if (imageStillExists) {
          imageUrl = existingCharacter.imageUrl;
        } else {
          // Find first non-placeholder image
          const nonPlaceholder = imagesToSave.find(img => !img.url.includes('placeholder.svg'));
          imageUrl = nonPlaceholder ? nonPlaceholder.url : imagesToSave[imagesToSave.length - 1].url;
        }
      } else {
        // Find first non-placeholder image
        const nonPlaceholder = imagesToSave.find(img => !img.url.includes('placeholder.svg'));
        imageUrl = nonPlaceholder ? nonPlaceholder.url : imagesToSave[imagesToSave.length - 1].url;
      }
    } else {
      // Keep existing image if no update is provided
      imageUrl = existingCharacter.imageUrl;
    }
    
    // Prepare the character to save
    const characterToSave: DexieCharacter = {
      id,
      name: characterUpdate.name ?? existingCharacter.name,
      description: characterUpdate.description ?? existingCharacter.description,
      imageUrl: imageUrl,
      modelUrl: characterUpdate.modelUrl ?? existingCharacter.modelUrl,
      story: characterUpdate.chapterText ?? existingCharacter.story,
    };
    
    // Save the updated character with its images
    await db.saveCharacterWithImages({
      ...characterToSave,
      images: imagesToSave
    });
    
    // Return the updated character
    const updatedCharacter = await getCharacter(id);
    
    if (!updatedCharacter) {
      throw new Error("Failed to retrieve updated character");
    }
    
    return updatedCharacter;
  } catch (error) {
    console.error(`Error updating character ${id}:`, error);
    throw error;
  }
}

// Add an image to a character
// Define a new interface for the input type for addCharacterImage
interface AddCharacterImageInput extends Omit<CharacterImage, "id"> {
  setAsMain?: boolean;
}
export async function addCharacterImage(characterId: number, image: AddCharacterImageInput): Promise<Character> {
  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Get the character with its images
    const character = await db.getCharacterWithImages(characterId);
    
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    
    // Add the new image
    const images = character.images ?? [];
    images.push({
      characterId,
      url: image.url,
      caption: image.caption,
    });
    
    // Update the main image only if:
    // 1. There was no main image before OR
    // 2. The current main image is a placeholder OR
    // 3. The new image is explicitly marked to be used as main
    const shouldUpdateMainImage = 
      !character.imageUrl || 
      character.imageUrl.includes('placeholder.svg') ||
      image.setAsMain === true;
    
    const updatedCharacter = {
      ...character,
      images,
      // Only update imageUrl if needed
      imageUrl: shouldUpdateMainImage ? image.url : character.imageUrl
    };
    
    // Save the updated character
    await db.saveCharacterWithImages(updatedCharacter);
    
    // Return the updated character
    const result = await getCharacter(characterId);
    
    if (!result) {
      throw new Error("Failed to retrieve updated character");
    }
    
    return result;
  } catch (error) {
    console.error(`Error adding image to character ${characterId}:`, error);
    throw error;
  }
}

// Remove an image from a character
export async function removeCharacterImage(characterId: number, imageId: string): Promise<Character> {
  try {
    await initializeData();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Get the character with its images
    const character = await db.getCharacterWithImages(characterId);
    
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    
    // Find the image being removed (for reference)
    const removingImage = character.images?.find(img => {
      const imgId = img.id !== undefined ? img.id.toString() : '';
      return imgId === imageId;
    });
    
    // Filter out the image to remove
    const images = character.images?.filter(img => {
      // Convert number IDs to string for comparison
      const imgId = img.id !== undefined ? img.id.toString() : '';
      return imgId !== imageId;
    }) ?? [];
    
    // Check if we're removing the main image
    const mainImageRemoved = removingImage && character.imageUrl === removingImage.url;
    
    // Update imageUrl if we removed the main image
    let newMainImageUrl = character.imageUrl;
    
    if (mainImageRemoved) {
      // If there are remaining images, choose the first non-placeholder
      if (images.length > 0) {
        const nonPlaceholder = images.find(img => !img.url.includes('placeholder.svg'));
        newMainImageUrl = nonPlaceholder 
          ? nonPlaceholder.url 
          : images[images.length - 1].url;
      } else {
        // If no images left, use placeholder
        newMainImageUrl = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(character.name)}`;
      }
    }
    
    const updatedCharacter = {
      ...character,
      images,
      imageUrl: mainImageRemoved ? newMainImageUrl : character.imageUrl
    };
    
    // Save the updated character
    await db.saveCharacterWithImages(updatedCharacter);
    
    // Return the updated character
    const result = await getCharacter(characterId);
    
    if (!result) {
      throw new Error("Failed to retrieve updated character");
    }
    
    return result;
  } catch (error) {
    console.error(`Error removing image ${imageId} from character ${characterId}:`, error);
    throw error;
  }
}

// Document functions are currently stubs since we haven't implemented document storage in the database yet
// We can improve these in a future iteration

export async function addCharacterDocument(
  characterId: number,
  _documentData: Omit<CharacterDocument, "id">,
): Promise<Character> {
  // For now, we'll just return the character without changes
  // In a future iteration, we can add document support to the database
  const character = await getCharacter(characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }
  return character;
}

export async function removeCharacterDocument(
  characterId: number, 
  _documentId: string
): Promise<Character> {
  // For now, we'll just return the character without changes
  // In a future iteration, we can add document support to the database
  const character = await getCharacter(characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }
  return character;
}
