# Suggested Commands for Buddhist Sutra App Development

## Development Server
```bash
# Start the development server with Next.js
pnpm dev

# Build the application for production
pnpm build

# Start the production server
pnpm start
```

## Code Quality
```bash
# Run linting
pnpm lint

# TypeScript type checking
npx tsc --noEmit
```

## Package Management
```bash
# Install dependencies
pnpm install

# Add a new package
pnpm add [package-name]

# Add a dev dependency
pnpm add -D [package-name]
```

## Utility Commands (Windows)
```bash
# List files and directories
dir

# Change directory
cd [directory-name]

# Create a directory
mkdir [directory-name]

# Navigate to parent directory
cd ..

# Display file content
type [file-name]

# Find text in files (Windows PowerShell)
Select-String -Path "*.ts*" -Pattern "search-term"

# Git commands
git status
git add .
git commit -m "commit message"
git push
git pull
```

## Project-Specific Paths
```bash
# Main component directories
cd components        # UI components
cd app               # Next.js app directory
cd lib               # Utilities and data functions
cd styles            # Additional styles

# Key files
cd components/model-viewer.tsx  # 3D model viewer component
cd lib/data.ts                  # Data persistence functions
```

## Note on Running the Application
- The application uses Next.js with the App Router
- ESLint and TypeScript errors are ignored during builds (as configured in next.config.mjs)
- Images are set to unoptimized in the Next.js config