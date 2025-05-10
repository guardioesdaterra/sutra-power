// This file contains functions to interact with data storage
// We're using localStorage for persistence in this example

export type CharacterImage = {
  id: string
  url: string
  caption?: string
}

export type CharacterDocument = {
  id: string
  url: string
  name: string
  type: "pdf" | "text"
}

export type Character = {
  id: number
  name: string
  description: string
  imageUrl: string
  images: CharacterImage[]
  modelUrl: string
  chapterText: string
  documents: CharacterDocument[]
}

export type Chapter = {
  id: number
  title: string
  content: string
  characterId: number
}

export type Model = {
  id: number
  name: string
  description: string
  modelUrl: string
  characterId: number
}

// Real character names from the provided list
const characterNames = [
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
const descriptions = [
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
  return Array.from({ length: 54 }, (_, i) => ({
    id: i + 1,
    name: characterNames[i],
    description: descriptions[i] || `A character from the ancient Buddhist Sutra`,
    imageUrl: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(characterNames[i])}`,
    images: [
      {
        id: `main-${i + 1}`,
        url: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(characterNames[i])}`,
        caption: `Main image of ${characterNames[i]}`,
      },
    ],
    modelUrl: "/assets/3d/duck.glb",
    chapterText: `<h2>Chapter ${i + 1}: The Teachings of ${characterNames[i]}</h2>
      <p>In ancient times, when the Buddha was residing at the Jetavana monastery, ${characterNames[i]} approached and spoke about the nature of wisdom.</p>
      <p>"The path to enlightenment requires diligent practice and deep understanding. One who is mindful observes the rising and falling of phenomena, and through this observation, insight develops."</p>
      <p>${characterNames[i]} continued, "Just as a skilled craftsman can distinguish between different types of wood, a wise person can distinguish between wholesome and unwholesome states of mind."</p>
      <p>This teaching was given to help the disciples develop their understanding of the path to liberation.</p>`,
    documents: [],
  }))
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

// Data persistence using localStorage
const STORAGE_KEYS = {
  CHARACTERS: "sutra-ar-characters",
  CHAPTERS: "sutra-ar-chapters",
  MODELS: "sutra-ar-models",
}

// Initialize data in localStorage if it doesn't exist
const initializeData = () => {
  if (typeof window === "undefined") return

  // Check if data exists in localStorage
  if (!localStorage.getItem(STORAGE_KEYS.CHARACTERS)) {
    const characters = generateInitialCharacters()
    const chapters = generateInitialChapters(characters)
    const models = generateInitialModels(characters)

    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters))
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))
  }
}

// Get all characters
export async function getCharacters(): Promise<Character[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    return generateInitialCharacters()
  }

  initializeData()
  const charactersJson = localStorage.getItem(STORAGE_KEYS.CHARACTERS)
  return charactersJson ? JSON.parse(charactersJson) : []
}

// Get a specific character
export async function getCharacter(id: number): Promise<Character | undefined> {
  const characters = await getCharacters()
  return characters.find((char) => char.id === id)
}

// Get all chapters
export async function getChapters(): Promise<Chapter[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    const characters = await getCharacters()
    return generateInitialChapters(characters)
  }

  initializeData()
  const chaptersJson = localStorage.getItem(STORAGE_KEYS.CHAPTERS)
  return chaptersJson ? JSON.parse(chaptersJson) : []
}

// Get a specific chapter
export async function getChapter(id: number): Promise<Chapter | undefined> {
  const chapters = await getChapters()
  return chapters.find((chapter) => chapter.id === id)
}

// Get all models
export async function getModels(): Promise<Model[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    const characters = await getCharacters()
    return generateInitialModels(characters)
  }

  initializeData()
  const modelsJson = localStorage.getItem(STORAGE_KEYS.MODELS)
  return modelsJson ? JSON.parse(modelsJson) : []
}

// Get a specific model
export async function getModel(id: number): Promise<Model | undefined> {
  const models = await getModels()
  return models.find((model) => model.id === id)
}

// Create a new character
export async function createCharacter(character: Omit<Character, "id">): Promise<Character> {
  const characters = await getCharacters()
  const newCharacter = { ...character, id: characters.length + 1 }

  characters.push(newCharacter)
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  // Also create corresponding chapter and model
  const chapters = await getChapters()
  const newChapter: Chapter = {
    id: chapters.length + 1,
    title: `Chapter ${newCharacter.id}: The Teachings of ${newCharacter.name}`,
    content: `This is the chapter about ${newCharacter.name}.`,
    characterId: newCharacter.id,
  }
  chapters.push(newChapter)
  localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters))

  const models = await getModels()
  const newModel: Model = {
    id: models.length + 1,
    name: `${newCharacter.name} Model`,
    description: "3D model representation of the character",
    modelUrl: newCharacter.modelUrl,
    characterId: newCharacter.id,
  }
  models.push(newModel)
  localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))

  return newCharacter
}

// Update an existing character
export async function updateCharacter(id: number, characterUpdate: Partial<Character>): Promise<Character> {
  const characters = await getCharacters()
  const index = characters.findIndex((char) => char.id === id)

  if (index === -1) {
    throw new Error(`Character with ID ${id} not found`)
  }

  const updatedCharacter = { ...characters[index], ...characterUpdate }
  characters[index] = updatedCharacter
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  // Update corresponding model if modelUrl changed
  if (characterUpdate.modelUrl) {
    const models = await getModels()
    const modelIndex = models.findIndex((model) => model.characterId === id)
    if (modelIndex !== -1) {
      models[modelIndex] = {
        ...models[modelIndex],
        modelUrl: characterUpdate.modelUrl,
        name: characterUpdate.name ? `${characterUpdate.name} Model` : models[modelIndex].name,
      }
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))
    }
  }

  // Update corresponding chapter if name changed
  if (characterUpdate.name) {
    const chapters = await getChapters()
    const chapterIndex = chapters.findIndex((chapter) => chapter.characterId === id)
    if (chapterIndex !== -1) {
      chapters[chapterIndex] = {
        ...chapters[chapterIndex],
        title: `Chapter ${id}: The Teachings of ${characterUpdate.name}`,
      }
      localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters))
    }
  }

  return updatedCharacter
}

// Add an image to a character
export async function addCharacterImage(characterId: number, image: Omit<CharacterImage, "id">): Promise<Character> {
  const characters = await getCharacters()
  const index = characters.findIndex((char) => char.id === characterId)

  if (index === -1) {
    throw new Error(`Character with ID ${characterId} not found`)
  }

  const newImage = { ...image, id: `img-${Date.now()}` }
  characters[index].images = [...(characters[index].images || []), newImage]
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  return characters[index]
}

// Remove an image from a character
export async function removeCharacterImage(characterId: number, imageId: string): Promise<Character> {
  const characters = await getCharacters()
  const index = characters.findIndex((char) => char.id === characterId)

  if (index === -1) {
    throw new Error(`Character with ID ${characterId} not found`)
  }

  characters[index].images = characters[index].images.filter((img) => img.id !== imageId)
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  return characters[index]
}

// Add a document to a character
export async function addCharacterDocument(
  characterId: number,
  document: Omit<CharacterDocument, "id">,
): Promise<Character> {
  const characters = await getCharacters()
  const index = characters.findIndex((char) => char.id === characterId)

  if (index === -1) {
    throw new Error(`Character with ID ${characterId} not found`)
  }

  const newDocument = { ...document, id: `doc-${Date.now()}` }
  characters[index].documents = [...(characters[index].documents || []), newDocument]
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  return characters[index]
}

// Remove a document from a character
export async function removeCharacterDocument(characterId: number, documentId: string): Promise<Character> {
  const characters = await getCharacters()
  const index = characters.findIndex((char) => char.id === characterId)

  if (index === -1) {
    throw new Error(`Character with ID ${characterId} not found`)
  }

  characters[index].documents = characters[index].documents.filter((doc) => doc.id !== documentId)
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))

  return characters[index]
}
