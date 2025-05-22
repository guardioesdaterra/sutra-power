# EcoMapper Directory Setup Script
# Create all necessary directories for the EcoMapper project

$directories = @(
    "src/api/supabase",
    "src/api/external",
    "src/assets/icons",
    "src/assets/images",
    "src/components/core",
    "src/components/features",
    "src/components/forms",
    "src/components/layout",
    "src/components/map",
    "src/components/shared",
    "src/context",
    "src/data/local",
    "src/data/sync",
    "src/data/schemas",
    "src/features/auth",
    "src/features/map",
    "src/features/markers",
    "src/features/profile",
    "src/features/categories",
    "src/features/media",
    "src/hooks",
    "src/pages/auth",
    "src/pages/map",
    "src/pages/profile",
    "src/pages/settings",
    "src/styles",
    "src/types",
    "src/utils",
    "public/assets/markers",
    "public/assets/splash",
    "public/locales"
)

foreach ($dir in $directories) {
    $path = Join-Path -Path "." -ChildPath $dir
    Write-Host "Creating directory: $path"
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}

Write-Host "Directory structure created successfully!"