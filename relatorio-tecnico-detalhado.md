# Relatório Técnico Detalhado: Buddhist Sutra App

## 1. Visão Geral do Projeto

O Buddhist Sutra App é uma aplicação web completa projetada para organizar, visualizar e desenvolver a conexão entre a antiga sabedoria budista e personagens 3D modernos. A aplicação se concentra nos 54 personagens de um antigo Sutra Budista, oferecendo informações detalhadas, visualização de modelos 3D, descrições de personagens, textos de capítulos e galerias de imagens.

## 2. Stack Tecnológico

### 2.1. Frontend Framework
- **Next.js 15.2.4**: Framework React com renderização do lado do servidor (SSR), otimização de imagem e roteamento avançado.
- **App Router**: Utiliza o sistema de roteamento mais recente do Next.js baseado em sistema de arquivos.

### 2.2. UI e Estilização
- **React 19**: Versão mais recente do React com novos recursos e melhorias de performance.
- **Radix UI**: Biblioteca de componentes acessíveis e sem estilo, usada como base para a biblioteca UI personalizada.
- **Tailwind CSS 3.4.17**: Framework CSS utilitário para estilização rápida e responsiva.
- **tailwindcss-animate**: Plugin para adicionar animações ao Tailwind CSS.
- **clsx** e **class-variance-authority**: Utilidades para manipulação condicional de classes CSS.

### 2.3. Gerenciamento de Estado
- **React Hooks**: Para gerenciamento de estado local e efeitos colaterais.
- **localStorage**: Para persistência temporária de dados do lado do cliente.
- **Supabase** (planejado): Para futura migração do armazenamento de dados e autenticação.

### 2.4. Visualização 3D
- **Google Model Viewer**: Componente web para visualização de modelos 3D (```@google/model-viewer```).

### 2.5. Manipulação de Formulários
- **React Hook Form**: Para construção e validação de formulários.
- **Zod**: Para validação de esquema e tipo.

### 2.6. Componentes UI Avançados
- **Editor Rich Text**: Implementação personalizada para edição de texto formatado.
- **Uploader de Imagens e Documentos**: Componentes personalizados para upload de arquivos.

### 2.7. Renderização e Tema
- **next-themes**: Para suporte a temas claro/escuro.
- **embla-carousel-react**: Para carrosséis de imagens.

### 2.8. Integrações Futuras Planejadas
- **Supabase**: Para persistência de dados, autenticação e armazenamento de arquivos.

## 3. Arquitetura da Aplicação

### 3.1. Estrutura de Diretórios

```
buddhist-sutra-app/
├── app/                 # Diretório principal do Next.js App Router
│   ├── models/          # Páginas de modelos 3D
│   ├── chapters/        # Páginas de capítulos do Sutra
│   ├── characters/      # Páginas de personagens
│   │   ├── [id]/        # Detalhes e páginas de edição de personagens
│   │   └── new/         # Página de criação de personagens
│   ├── layout.tsx       # Componente de layout raiz
│   ├── page.tsx         # Página inicial
│   └── globals.css      # Estilos globais
├── components/          # Componentes reutilizáveis
│   ├── ui/              # Biblioteca de componentes UI
│   ├── model-viewer.tsx # Visualizador de modelos 3D
│   ├── rich-text-editor.tsx # Editor de texto formatado
│   └── ... (outros componentes)
├── hooks/               # Hooks React personalizados
├── lib/                 # Funções utilitárias e dados
│   ├── data.ts          # Funções de manipulação de dados
│   ├── sutra-data.ts    # Dados dos personagens
│   └── utils.ts         # Funções utilitárias gerais
├── public/              # Ativos estáticos
└── styles/              # Estilos adicionais
```

### 3.2. Padrão de Roteamento

A aplicação utiliza o sistema App Router do Next.js, que define rotas com base na estrutura de diretórios:

- `/`: Página inicial
- `/characters`: Lista de personagens
- `/characters/[id]`: Detalhes de um personagem específico
- `/characters/[id]/edit`: Edição de personagem
- `/characters/new`: Criação de novo personagem
- `/models`: Lista de modelos 3D
- `/models/[id]`: Visualização de modelo 3D específico
- `/chapters`: Lista de capítulos
- `/chapters/[id]`: Conteúdo de um capítulo específico

### 3.3. Padrão de Dados

O aplicativo atualmente utiliza `localStorage` para persistência de dados, com a seguinte estrutura:

```typescript
// Tipos de dados principais
export type Character = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  images: CharacterImage[];
  modelUrl: string;
  chapterText: string;
  documents: CharacterDocument[];
};

export type CharacterImage = {
  id: string;
  url: string;
  caption?: string;
};

export type CharacterDocument = {
  id: string;
  url: string;
  name: string;
  type: "pdf" | "text";
};

export type Chapter = {
  id: number;
  title: string;
  content: string;
  characterId: number;
};

export type Model = {
  id: number;
  name: string;
  description: string;
  modelUrl: string;
  characterId: number;
};
```

## 4. Componentes Principais

### 4.1. Visualizador de Modelos 3D (ModelViewer)

O componente `ModelViewer` é uma implementação avançada para renderizar modelos 3D usando a biblioteca `@google/model-viewer`. O componente:

- Carrega o script do Model Viewer dinamicamente
- Configura o ambiente de visualização 3D
- Fornece controles para zoom, rotação e manipulação do modelo
- Suporta auto-rotação e sombras
- Gerencia estados de carregamento e erro
- Implementa limpeza adequada para evitar vazamentos de memória

```typescript
useEffect(() => {
  // Verifica se o script já foi carregado
  if (document.querySelector('script[src*="model-viewer"]')) {
    setScriptLoaded(true)
    return
  }

  const script = document.createElement("script")
  script.src = "https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"
  script.type = "module"
  script.onload = () => setScriptLoaded(true)
  script.onerror = () => {
    console.error("Failed to load model-viewer script")
    setError(true)
    setIsLoading(false)
  }
  document.head.appendChild(script)
```

### 4.2. Editor de Texto Formatado (RichTextEditor)

O componente `RichTextEditor` permite a edição de conteúdo formatado com suporte a:

- Tags HTML básicas (headings, bold, italic, listas)
- Alinhamento de texto
- Visualização em tempo real do resultado formatado
- Inserção de tags HTML em texto selecionado

```typescript
export function RichTextEditor({ onChange, initialValue = "" }) {
  const [content, setContent] = useState(initialValue)
  const [view, setView] = useState("edit")

  // Função para inserir tags HTML no texto selecionado
  const insertTag = (openTag, closeTag) => {
    const textarea = document.getElementById("editor-textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end)

    setContent(newContent)
    onChange(newContent)
    
    // ...
  }
```

### 4.3. Galeria de Imagens (ImageGallery)

Componente que exibe e gerencia imagens associadas a um personagem, com funcionalidades para:

- Exibir imagens em grid ou carrossel
- Zoom em imagens individuais
- Adicionar novas imagens
- Remover imagens existentes
- Exibir legendas

### 4.4. Uploader de Documentos (DocumentUploader)

Permite fazer upload de documentos para um personagem com:

- Validação de tipos de arquivo
- Suporte para documentos PDF e de texto
- Gerenciamento de estados de carregamento
- Exibição de erros de upload
- Listagem dos documentos existentes

### 4.5. Navegação Principal (MainNav)

Componente responsivo que fornece:

- Links para todas as seções principais
- Alternador de tema claro/escuro
- Menu móvel para telas pequenas
- Destaque para a rota ativa
- Efeitos visuais em scrolling

```typescript
export function MainNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // ...
```

## 5. Fluxo de Dados

### 5.1. Gerenciamento de Estado Local

O aplicativo utiliza o `useState` e `useEffect` do React para gerenciar o estado dos componentes. Por exemplo:

```typescript
const [character, setCharacter] = useState(null)
const [isLoading, setIsLoading] = useState(true)
const [activeTab, setActiveTab] = useState("main")

useEffect(() => {
  const fetchCharacter = async () => {
    try {
      const characterData = await getCharacter(Number.parseInt(params.id))
      if (characterData) {
        setCharacter(characterData)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching character:", error)
      setIsLoading(false)
    }
  }

  fetchCharacter()
}, [params.id])
```

### 5.2. Persistência Local

Os dados são armazenados e recuperados do `localStorage` através de funções utilitárias em `lib/data.ts`:

```typescript
export async function getCharacters(): Promise<Character[]> {
  if (typeof window === "undefined") {
    // Server-side: return initial data
    return generateInitialCharacters()
  }

  initializeData()
  const charactersJson = localStorage.getItem(STORAGE_KEYS.CHARACTERS)
  return charactersJson ? JSON.parse(charactersJson) : []
}

export async function updateCharacter(id: number, characterUpdate: Partial<Character>): Promise<Character> {
  // Atualiza um personagem no localStorage
  const characters = await getCharacters()
  const index = characters.findIndex(c => c.id === id)
  
  if (index === -1) {
    throw new Error(`Character with ID ${id} not found`)
  }
  
  const updatedCharacter = { ...characters[index], ...characterUpdate }
  characters[index] = updatedCharacter
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters))
  
  return updatedCharacter
}
```

## 6. Funcionalidades Principais

### 6.1. Visualização de Personagens

- Listagem em grid de todos os 54 personagens com imagens e descrições curtas
- Página de detalhes com abas para diferentes tipos de informação:
  - Visão geral do personagem
  - Galeria de imagens
  - Modelo 3D interativo
  - Documentos associados
  - Texto completo do capítulo

### 6.2. Gerenciamento de Personagens

- Criação de novos personagens com nome, descrição, imagem e modelo 3D
- Edição de personagens existentes
- Upload e gerenciamento de imagens associadas
- Upload e gerenciamento de documentos associados
- Edição de texto de capítulo com formatação rich text

### 6.3. Visualização 3D

- Carregamento dinâmico de modelos 3D
- Controles de câmera (zoom, rotação, pan)
- Toggle de auto-rotação
- Iluminação e sombras configuradas
- Estados de carregamento e erro apropriados

### 6.4. Navegação e UX

- Navegação responsiva adaptada para dispositivos móveis e desktop
- Tema claro/escuro com alternância simples
- Animações suaves e efeitos visuais
- Feedback visual para carregamento de dados e operações

## 7. Questões Técnicas Identificadas

### 7.1. Segurança de Dados

O uso de `localStorage` apresenta limitações:

- **Capacidade limitada**: Geralmente 5-10MB por domínio
- **Sem sincronização entre dispositivos**: Os dados ficam restritos ao navegador local
- **Riscos de perda de dados**: Limpeza do cache do navegador pode resultar em perda de dados
- **Sem versionamento ou backup**: Não há sistema de backup ou versionamento de dados
- **Sem validação estrutural**: Não há garantia da integridade dos dados estruturais

### 7.2. Implementação do Model Viewer

O componente `ModelViewer` apresenta alguns problemas:

- **Potencial vazamento de memória**: Se não houver limpeza adequada no useEffect
- **Ausência de fallback**: Não há UI alternativa quando o WebGL não é suportado
- **Injeção dinâmica de script**: Pode causar problemas com políticas de segurança CSP
- **Manipulação direta do DOM**: O código manipula o DOM diretamente, o que pode ser frágil

### 7.3. Upload de Arquivos

O sistema de upload atual é simulado:

- **Funcionalidade simulada**: Os uploads são apenas simulados, sem armazenamento real
- **Validação limitada**: Validação básica de extensão, sem verificação de conteúdo ou tamanho
- **Interface de usuário simples**: Feedback limitado durante o processo de upload

### 7.4. Tipo e Segurança

Várias partes da aplicação têm problemas de tipagem:

- **Tipos incompletos**: Alguns componentes não têm tipagem adequada para props e estado
- **Parâmetros sem tipo**: Várias funções aceitam parâmetros sem definição de tipo
- **Validação de dados**: Validação inconsistente dos dados de entrada e saída

### 7.5. Otimização para SEO e Performance

- **Renderização do lado do cliente**: Muitos componentes são renderizados exclusivamente no cliente
- **Carregamento de dados ineficiente**: Buscas de dados no lado do cliente em componentes que poderiam ser renderizados no servidor
- **Falta de metadados para SEO**: Metatags insuficientes para otimização de mecanismos de busca

## 8. Plano de Migração para Supabase

O projeto planeja migrar o armazenamento de dados do `localStorage` para o Supabase, uma plataforma de backend como serviço com PostgreSQL.

### 8.1. Esquema de Banco de Dados Proposto

```sql
-- Characters table
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  model_url VARCHAR(255),
  chapter_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE character_images (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE character_documents (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8.2. Implementação de API com Supabase

A integração com Supabase usando o cliente JavaScript seria:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Exemplo de implementação de funções para personagens:

```typescript
// lib/data.ts (atualizado para Supabase)
export async function getCharacters(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    
  if (error) {
    console.error("Error fetching characters:", error)
    return []
  }
  
  return data || []
}

export async function getCharacter(id: number): Promise<Character | undefined> {
  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      character_images (*),
      character_documents (*)
    `)
    .eq('id', id)
    .single()
    
  if (error) {
    console.error("Error fetching character:", error)
    return undefined
  }
  
  return data
}
```

### 8.3. Armazenamento de Arquivos

Para armazenamento de imagens e modelos 3D, o Supabase Storage seria implementado:

```typescript
// Upload de imagem
export async function uploadImage(file, bucketName = 'character-images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file)
    
  if (error) {
    throw error
  }
  
  // Obter URL pública
  const { data: { publicUrl } } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath)
    
  return publicUrl
}
```

### 8.4. Autenticação e Segurança

Implementação de autenticação com Supabase:

```typescript
// Registro de usuário
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Login de usuário
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

Políticas de segurança em nível de linha (RLS) para proteger dados:

```sql
-- Permitir que usuários vejam todos os personagens
CREATE POLICY "Everyone can view characters"
ON characters FOR SELECT
USING (true);

-- Permitir que apenas usuários autenticados criem personagens
CREATE POLICY "Authenticated users can create characters"
ON characters FOR INSERT
TO authenticated
USING (true);

-- Permitir que apenas o proprietário edite seus personagens
CREATE POLICY "Users can only update their own characters"
ON characters FOR UPDATE
USING (auth.uid() = user_id);
```

## 9. Recomendações de Melhorias

### 9.1. Migração para Backend Serverless

- Implementar a migração para Supabase conforme planejado
- Criar esquema de banco de dados com relações e restrições adequadas
- Implementar autenticação e autorização com políticas RLS
- Migrar upload de arquivos para Supabase Storage

### 9.2. Melhorias de Tipagem e Validação

- Adicionar interfaces TypeScript para todas as props de componentes
- Implementar validação com Zod para todos os formulários
- Criar uma camada de validação de dados entre UI e armazenamento
- Garantir que todos os dados tenham tipagem consistente

### 9.3. Otimização de Performance

- Implementar carregamento lazy para imagens e modelos 3D
- Criar páginas com renderização híbrida (SSR + CSR)
- Otimizar os componentes React para reduzir re-renderizações
- Implementar paginação para listas longas de personagens

### 9.4. Melhorias na UX/UI

- Adicionar skeleton loaders para estados de carregamento
- Melhorar feedback visual durante operações (toasts, barras de progresso)
- Implementar suporte a gestos para manipulação de modelos 3D em dispositivos touch
- Melhorar o feedback de erro com mensagens contextuais

### 9.5. Segurança e Robustez

- Implementar validação de dados em tempo real
- Adicionar sanitização HTML para conteúdo rich text
- Implementar limitações de tamanho e tipo para uploads
- Criar sistema de backup e versionamento de dados

## 10. Conclusão

O Buddhist Sutra App é uma aplicação bem estruturada com uma UI limpa e funcionalidades abrangentes para gerenciar e visualizar os 54 personagens do Sutra Budista. A implementação atual depende de armazenamento do lado do cliente, o que limita suas capacidades mas permite uma demonstração funcional.

A migração planejada para o banco de dados serverless Supabase aprimorará significativamente as funcionalidades da aplicação, permitindo persistência de dados real, colaboração multi-usuário e desenvolvimento de recursos mais robustos. As recomendações delineadas neste documento fornecem um roteiro para melhorar a confiabilidade, segurança e experiência de usuário da aplicação.

Prioridades imediatas para melhoria:
1. Implementação de tipos TypeScript adequados em toda a aplicação
2. Aprimoramento do tratamento de erros em componentes críticos
3. Correção da implementação do visualizador de modelos para evitar vazamentos de memória
4. Configuração da integração com Supabase
5. Implementação de armazenamento adequado para imagens e modelos 3D

Ao abordar essas questões e implementar as melhorias recomendadas, o Buddhist Sutra App se tornará uma aplicação mais robusta, segura e amigável ao usuário para explorar e interagir com o antigo Sutra Budista e seus personagens. 