// This file contains functions to interact with data storage
// Using Dexie.js (IndexedDB) for data persistence

import { db, Character as DexieCharacter, isIndexedDBSupported, initializeDatabase } from "./db";

export interface CharacterImage {
  id?: number; // Changed from string, optional for new images
  url: string;
  caption?: string;
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
    let imageUrl = ""; // Set to empty string, to be user-defined
    
    // For primary characters, use sample Buddhist imagery
    // if (i < 5) {
    //   // These are sample image paths that would be used in production
    //   const sampleImages = [
    //     "/assets/buddha.jpg",
    //     "/assets/samantabhadra.jpg", 
    //     "/assets/manjushri.jpg",
    //     "/assets/meghashri.jpg",
    //     "/assets/sagaramegha.jpg"
    //   ];
    //   imageUrl = sampleImages[i];
    // }
    
    return {
      id: i + 1,
      name: characterNames[i],
      description: descriptions[i] ?? `A character from the ancient Buddhist Sutra`,
      imageUrl: imageUrl, // Will be empty or set by user
      images: [], // Initialize with no images
      modelUrl: "", // Set to empty string, to be user-defined
      chapterText: `<h2>Chapter ${i + 1}: The Teachings of ${characterNames[i]}</h2>
        <p>In ancient times, when the Buddha was residing at the Jetavana monastery, ${characterNames[i]} approached and spoke about the nature of wisdom.</p>
        <p>Further details and specific teachings related to ${characterNames[i]} would be populated here. This section is intended to hold rich textual content associated with the character, potentially including excerpts from sutras, commentaries, or narrative stories.</p>
        <p>The structure of this content can be HTML, allowing for formatting such as headings, paragraphs, lists, and blockquotes to organize the information effectively. For example, one might include:</p>
        <ul>
          <li>Key teachings or sutras associated with ${characterNames[i]}.</li>
          <li>Iconographic descriptions and symbolism.</li>
          <li>Stories and legends involving the character.</li>
          <li>Relationships with other characters in the Buddhist pantheon.</li>
        </ul>
        <p>This textual data is crucial for providing comprehensive information about each character within the SutraPower application.</p>`,
      documents: [], // Added missing documents property
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
  // Use imageUrl if it exists and is not empty
  if (character.imageUrl && character.imageUrl.trim() !== '') {
    return character.imageUrl;
  }
  
  // Otherwise use first image from gallery
  if (character.images && character.images.length > 0) {
    return character.images[0].url;
  }
  
  // Otherwise return empty string
  return "";
}

// Function to convert Dexie character (with images pre-fetched) to API-like Character
const convertToApiCharacter = (dexieChar: DexieCharacter & { images?: CharacterImage[] }): Character => {
  // Ensure documents array exists, even if empty
  const documents: CharacterDocument[] = (dexieChar as any).documents || [];

  return {
    id: dexieChar.id!, // id will exist if it's from DB
    name: dexieChar.name,
    description: dexieChar.description,
    imageUrl: dexieChar.imageUrl || "",
    images: dexieChar.images || [],
    modelUrl: dexieChar.modelUrl || "",
    chapterText: dexieChar.story || "", // Assuming chapterText maps to story in DexieCharacter
    documents: documents
  };
};

export async function getCharacters(): Promise<Character[]> {
  if (typeof window === "undefined") return []; // Guard for SSR

  try {
    await initializeDatabase(); // Ensures DB is initialized
    
    // Fetch all characters. Images will be fetched on demand or if we adapt this.
    const dexieCharacters = await db.characters.toArray();
    
    const characters: Character[] = [];
    for (const dc of dexieCharacters) {
      // Fetch images for each character using the helper from db.ts
      const characterWithDetails = await db.getCharacterWithImages(dc.id!);
      if (characterWithDetails) {
        characters.push(convertToApiCharacter(characterWithDetails as any)); // Cast needed due to DexieCharacter vs Character mismatch potential
      }
    }
    return characters;

  } catch (error) {
    console.error("Failed to get characters:", error);
    return [];
  }
}

export async function getCharacter(id: number): Promise<Character | undefined> {
  if (typeof window === "undefined") return undefined;

  try {
    await initializeDatabase(); // Ensures DB is initialized
    
    const characterWithDetails = await db.getCharacterWithImages(id);
    
    if (characterWithDetails) {
      return convertToApiCharacter(characterWithDetails as any); // Cast needed
    }
    return undefined;
  } catch (error) {
    console.error(`Failed to get character ${id}:`, error);
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
    await initializeDatabase();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Convert the Character type to DexieCharacter type
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
    await initializeDatabase();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Get existing character with images
    const existingCharacter = await db.getCharacterWithImages(id);
    
    if (!existingCharacter) {
      throw new Error(`Character with ID ${id} not found`);
    }
    
    // Prepare the updated character data
    const updatedCharacter: DexieCharacter & { images?: any[] } = {
      id,
      name: characterUpdate.name ?? existingCharacter.name,
      description: characterUpdate.description ?? existingCharacter.description,
      imageUrl: characterUpdate.imageUrl ?? existingCharacter.imageUrl,
      modelUrl: characterUpdate.modelUrl ?? existingCharacter.modelUrl,
      story: characterUpdate.chapterText ?? existingCharacter.story,
    };
    
    // Handle images update if provided
    if (characterUpdate.images) {
      updatedCharacter.images = characterUpdate.images.map(img => ({
        id: typeof img.id === 'number' ? img.id : undefined,
        characterId: id,
        url: img.url,
        caption: img.caption
      }));
    } else {
      // Keep existing images
      updatedCharacter.images = existingCharacter.images;
    }
    
    // Save the updated character
    await db.saveCharacterWithImages(updatedCharacter);
    
    // Return the updated character
    const result = await getCharacter(id);
    if (!result) {
      throw new Error("Failed to retrieve updated character");
    }
    
    return result;
  } catch (error) {
    console.error(`Error updating character ${id}:`, error);
    throw error;
  }
}

// Add an image to a character
interface AddCharacterImageInput extends Omit<CharacterImage, "id" | "characterId"> {
  setAsMain?: boolean;
}

export async function addCharacterImage(characterId: number, image: AddCharacterImageInput): Promise<Character> {
  try {
    await initializeDatabase();
    
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
    const newImage = {
      characterId,
      url: image.url,
      caption: image.caption,
    };
    
    images.push(newImage);
    
    // Update the character with new image
    const updatedCharacter = {
      ...character,
      images,
      // Update imageUrl if setAsMain is true
      imageUrl: image.setAsMain ? image.url : character.imageUrl
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
export async function removeCharacterImage(characterId: number, imageId: number): Promise<Character> {
  try {
    await initializeDatabase();
    
    if (!isIndexedDBSupported()) {
      throw new Error("IndexedDB is not supported in this browser");
    }
    
    // Get the character with its images
    const character = await db.getCharacterWithImages(characterId);
    
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }
    
    // Find the image being removed (for reference)
    const removingImage = character.images?.find(img => img.id === imageId);
    
    // Filter out the image to remove
    const images = character.images?.filter(img => img.id !== imageId) ?? [];
    
    // Check if we're removing the main image
    const mainImageRemoved = removingImage && character.imageUrl === removingImage.url;
    
    // Update imageUrl if we removed the main image
    let newMainImageUrl = character.imageUrl;
    
    if (mainImageRemoved) {
      // If there are remaining images, choose the first one as main
      if (images.length > 0) {
        newMainImageUrl = images[0].url;
      } else {
        // If no images left, clear the imageUrl
        newMainImageUrl = "";
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
