# Code Style and Conventions

## TypeScript Usage
- The project uses TypeScript for type safety
- Interfaces and types are defined for data structures in lib/data.ts
- Type annotations are used for function parameters and return values
- React component props are typed

## Component Structure
- Components are defined using functional components
- React hooks (useState, useEffect, useRef) are used for state management and effects
- Client components are marked with "use client" directive at the top
- Server components are the default in the app router

## File Organization
- Component files are named in kebab-case.tsx
- Each component is exported using named exports
- Related components are grouped in the same directory
- Utility functions are placed in lib/ directory

## Naming Conventions
- Components use PascalCase (e.g., `ModelViewer`, `RichTextEditor`)
- Functions and variables use camelCase
- Types and interfaces use PascalCase
- Constants use camelCase (could be improved to use CONSTANT_CASE)
- File names use kebab-case

## Styling
- Tailwind CSS is used for styling
- Class names are applied using the className attribute
- Conditional classes are managed with clsx and tailwind-merge
- Design tokens are defined in the Tailwind config
- Dark mode support is implemented using next-themes

## Error Handling
- Try-catch blocks are used for error handling in async operations
- Console.error is used for logging errors
- Error states are managed with useState

## Comments
- Comments are used to explain complex logic
- JSDoc style comments are used for documentation in some places
- Code sections are separated by comments for readability

## React Best Practices
- React hooks rules are followed (don't call hooks conditionally)
- Dependencies arrays are properly managed in useEffect
- Event handlers are defined within components
- Refs are used for direct DOM manipulation when necessary

## Areas for Improvement
- More consistent type definitions across components
- Better error handling and user feedback
- More comprehensive documentation
- Consistent naming conventions for constants