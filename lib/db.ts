import Dexie, { Table } from 'dexie';

// Define interfaces for database tables
export interface Character {
  id?: number;
  name: string;
  description: string;
  story?: string;
  imageUrl?: string;
  modelUrl?: string;
  images?: CharacterImage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CharacterImage {
  id?: number;
  characterId: number;
  url: string;
  caption?: string;
  order?: number;
}

export interface LocalSettings {
  id?: number;
  key: string;
  value: unknown;
}

// Define the database
class SutraPowerDatabase extends Dexie {
  characters!: Table<Character>;
  characterImages!: Table<CharacterImage>;
  settings!: Table<LocalSettings>;

  constructor() {
    super('sutraPowerDB');
    this.version(1).stores({
      characters: '++id, name, createdAt, updatedAt',
      characterImages: '++id, characterId, order',
      settings: '++id, key'
    });
  }

  // Helper method to get a character with its images
  async getCharacterWithImages(id: number): Promise<Character | undefined> {
    const character = await this.characters.get(id);
    if (!character) return undefined;
    
    const images = await this.characterImages
      .where('characterId')
      .equals(id)
      .sortBy('order');
    
    return { ...character, images };
  }

  // Helper method to save a character with its images
  async saveCharacterWithImages(character: Character): Promise<number> {
    const images = character.images ?? [];
    delete character.images; // Remove images before saving the character

    // Start transaction
    return await this.transaction('rw', [this.characters, this.characterImages], async () => {
      // If character has an id, update it, otherwise create new
      let characterId: number;
      
      if (character.id) {
        character.updatedAt = new Date();
        await this.characters.update(character.id, character);
        characterId = character.id;
      } else {
        character.createdAt = new Date();
        character.updatedAt = new Date();
        characterId = await this.characters.add(character);
      }
      
      // Delete existing images for this character if updating
      if (character.id) {
        await this.characterImages.where('characterId').equals(characterId).delete();
      }
      
      // Add the images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        await this.characterImages.add({
          ...image,
          characterId,
          order: i
        });
      }
      
      return characterId;
    });
  }

  // Helper method to get a setting
  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await this.settings.where('key').equals(key).first();
    return setting ? (setting.value as T) : defaultValue;
  }

  // Helper method to set a setting
  async setSetting(key: string, value: unknown): Promise<void> {
    const existingSetting = await this.settings.where('key').equals(key).first();
    if (existingSetting) {
      await this.settings.update(existingSetting.id!, { value });
    } else {
      await this.settings.add({ key, value });
    }
  }
}

// Create and export the DB instance
export const db = new SutraPowerDatabase();

// Export a function to check if IndexedDB is supported
export function isIndexedDBSupported(): boolean {
  return 'indexedDB' in window && window.indexedDB !== null;
}

// Initialize the database
export async function initializeDatabase() {
  try {
    // Check if we need to migrate from localStorage
    const needsMigration = await db.getSetting('migratedFromLocalStorage', false);
    
    if (!needsMigration) {
      await migrateFromLocalStorage();
      await db.setSetting('migratedFromLocalStorage', true);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Migrate data from localStorage to IndexedDB
async function migrateFromLocalStorage() {
  try {
    // Check if we have characters in localStorage
    const localCharacters = localStorage.getItem('characters');
    if (localCharacters) {
      const characters = JSON.parse(localCharacters) as Character[];
      
      // Add each character to the database
      for (const char of characters) {
        await db.saveCharacterWithImages(char);
      }
      
      console.log('Successfully migrated characters from localStorage');
    }
    
    // Migrate any other data as needed...
    
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
} 