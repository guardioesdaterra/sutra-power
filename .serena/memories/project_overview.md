# Buddhist Sutra App

## Project Purpose
The Buddhist Sutra App is a web application designed to organize, visualize, and provide information about the 54 characters from an ancient Buddhist Sutra. The app allows users to view character details, 3D models, images, documents, and chapter texts associated with each character.

## Tech Stack
- **Frontend Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.17 with tailwindcss-animate
- **UI Components**: Radix UI components with custom shadcn/ui implementation
- **Form Handling**: React Hook Form with Zod for validation
- **Data Management**: Currently using localStorage for data persistence (planned to be improved)
- **3D Visualization**: Google Model Viewer (@google/model-viewer)
- **Theming**: next-themes for dark/light mode
- **Animation**: Tailwind animations and transitions

## Current Data Storage
Currently, the app uses localStorage for data persistence, which has several limitations:
- Limited storage capacity (5-10MB)
- No synchronization between devices
- Risk of data loss with browser cache clearing
- No robust validation or backup system

## Key Features
- Character profiles with detailed information
- 3D model visualization using Google Model Viewer
- Image galleries with upload functionality
- Document management for PDFs and text files
- Rich text editing for chapter content
- Light/dark theme support
- Responsive layout for mobile and desktop

## Main Components
- ModelViewer: For displaying 3D models (currently has memory leak issues)
- RichTextEditor: Custom editor for formatted text
- ImageGallery: For displaying and managing character images
- DocumentUploader: For managing character documents
- MainNav: Main navigation component
- Character-related components for listing and detail views

## Known Issues
1. Memory leaks in the ModelViewer component causing WebGL crashes
2. localStorage limitations for data persistence
3. Limited validation and type safety in some parts of the code
4. Client-side rendering affecting SEO and initial load performance
5. Limited offline capabilities

## Improvement Areas
The app needs improvements in several areas:
1. Better data persistence with IndexedDB or similar solution
2. Fixed ModelViewer implementation to prevent memory leaks
3. Migration to Next.js Server Components for better SEO
4. Enhanced user experience with loading states and feedback
5. Offline capabilities as a Progressive Web App