# EcoMapper Project Setup PowerShell Script
# This script initializes the EcoMapper Ionic React application with all required dependencies

Write-Host "🌱 Setting up EcoMapper - Environmental Mapping Application"
Write-Host "=========================================================="

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..."
    npm install -g pnpm@8.10.0
}

# Check if Ionic CLI is installed
if (-not (Get-Command ionic -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Ionic CLI..."
    pnpm add -g @ionic/cli@7.1.1
}

# Create project directory
$projectDir = "ecomapper"
if (-not (Test-Path $projectDir)) {
    New-Item -ItemType Directory -Path $projectDir | Out-Null
}

# Navigate to project directory (in script context)
Set-Location -Path $projectDir

# Create pnpm-workspace.yaml
Write-Host "Creating pnpm workspace configuration..."
@"
packages:
  - '.'
"@ | Out-File -FilePath "pnpm-workspace.yaml" -Encoding utf8

# Create package.json with specific versions
Write-Host "Creating package.json with specific versions..."
@"
{
  "name": "ecomapper",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@capacitor/android": "5.5.1",
    "@capacitor/camera": "5.0.7",
    "@capacitor/core": "5.5.1",
    "@capacitor/geolocation": "5.0.6",
    "@capacitor/ios": "5.5.1",
    "@capacitor/storage": "5.0.6",
    "@capacitor/splash-screen": "5.0.6",
    "@capacitor/network": "5.0.6",
    "@capacitor/device": "5.0.6",
    "@ionic/react": "7.5.4",
    "@ionic/react-router": "7.5.4",
    "@supabase/supabase-js": "2.39.0",
    "date-fns": "2.30.0",
    "leaflet": "1.9.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-leaflet": "4.2.1",
    "react-leaflet-cluster": "2.1.0",
    "react-router-dom": "6.20.0",
    "@turf/turf": "6.5.0",
    "dexie": "3.2.4",
    "zustand": "4.4.6"
  },
  "devDependencies": {
    "@capacitor/cli": "5.5.1",
    "@types/leaflet": "1.9.8",
    "@types/react": "18.2.38",
    "@types/react-dom": "18.2.17",
    "@vitejs/plugin-react": "4.2.0",
    "typescript": "5.2.2",
    "vite": "5.0.0"
  },
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    "ionic:build": "vite build",
    "ionic:serve": "vite"
  },
  "engines": {
    "node": ">=18.17.1",
    "pnpm": ">=8.10.0"
  }
}
"@ | Out-File -FilePath "package.json" -Encoding utf8

# Create environment file template
Write-Host "Creating environment file template..."
@"
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Map Configuration
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors

# App Configuration
VITE_APP_NAME=EcoMapper
VITE_DEFAULT_LOCATION_LAT=0
VITE_DEFAULT_LOCATION_LNG=0
VITE_DEFAULT_ZOOM=13
"@ | Out-File -FilePath ".env.example" -Encoding utf8

# Update project configuration
Write-Host "Updating project configuration..."

# Update capacitor.config.ts
@"
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ecomapper.app',
  appName: 'EcoMapper',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
    },
    Geolocation: {
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"]
    }
  }
};

export default config;
"@ | Out-File -FilePath "capacitor.config.ts" -Encoding utf8

# Create basic folder structure
Write-Host "Creating folder structure..."
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
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# Create Supabase client setup
Write-Host "Setting up Supabase client..."
@"
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export default supabase;
"@ | Out-File -FilePath "src/api/supabase/supabaseClient.ts" -Encoding utf8

# Set up vite.config.ts
Write-Host "Configuring Vite..."
@"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
"@ | Out-File -FilePath "vite.config.ts" -Encoding utf8

# Update tsconfig.json to use path aliases
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding utf8

# Create tsconfig.node.json
@"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
"@ | Out-File -FilePath "tsconfig.node.json" -Encoding utf8

# Create basic Auth context
Write-Host "Creating basic Auth context..."
@"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '@/api/supabase/supabaseClient';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
"@ | Out-File -FilePath "src/context/AuthContext.tsx" -Encoding utf8

# Create IndexedDB setup
Write-Host "Setting up IndexedDB with Dexie..."
@"
import Dexie, { Table } from 'dexie';

// Define interfaces for database tables
interface OfflineFeature {
  id?: number;
  data: any;
  photos: Array<{ file: File; preview: string }>;
  status: 'pending' | 'syncing' | 'error';
  syncedAt: Date | null;
  errorMessage?: string;
}

interface CachedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  updatedAt: Date;
}

interface CachedMapTile {
  url: string;
  blob: Blob;
  createdAt: Date;
}

class AppDatabase extends Dexie {
  offlineFeatures!: Table<OfflineFeature, number>;
  categories!: Table<CachedCategory, string>;
  mapTiles!: Table<CachedMapTile, string>;

  constructor() {
    super('ecoMapperDB');
    
    this.version(1).stores({
      offlineFeatures: '++id, status',
      categories: 'id, name',
      mapTiles: 'url, createdAt'
    });
  }
}

export const db = new AppDatabase();
export default db;
"@ | Out-File -FilePath "src/data/local/db.ts" -Encoding utf8

# Create basic Map context
Write-Host "Creating Map context..."
@"
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Map as LeafletMap, LatLngTuple } from 'leaflet';

type MapContextType = {
  mapRef: React.MutableRefObject<LeafletMap | null>;
  userLocation: LatLngTuple | null;
  setUserLocation: (location: LatLngTuple | null) => void;
  isLocating: boolean;
  centerOnUser: () => Promise<void>;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
};

const defaultLocation: LatLngTuple = [
  Number(import.meta.env.VITE_DEFAULT_LOCATION_LAT) || 0,
  Number(import.meta.env.VITE_DEFAULT_LOCATION_LNG) || 0
];

const defaultZoom = Number(import.meta.env.VITE_DEFAULT_ZOOM) || 13;

const MapContext = createContext<MapContextType>({
  mapRef: { current: null },
  userLocation: null,
  setUserLocation: () => {},
  isLocating: false,
  centerOnUser: async () => {},
  zoomLevel: defaultZoom,
  setZoomLevel: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(defaultZoom);

  const centerOnUser = async () => {
    if (!mapRef.current) return;
    
    try {
      setIsLocating(true);
      
      // Use Capacitor Geolocation in a real implementation
      // This is a placeholder
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });
      
      const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
      setUserLocation(newLocation);
      mapRef.current.setView(newLocation, zoomLevel);
    } catch (error) {
      console.error('Error getting location', error);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <MapContext.Provider value={{
      mapRef,
      userLocation,
      setUserLocation,
      isLocating,
      centerOnUser,
      zoomLevel,
      setZoomLevel,
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

export default MapContext;
"@ | Out-File -FilePath "src/context/MapContext.tsx" -Encoding utf8

# Create offline context
Write-Host "Creating Offline context..."
@"
import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '@/data/local/db';

type OfflineContextType = {
  isOnline: boolean;
  hasPendingChanges: boolean;
  syncData: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  hasPendingChanges: false,
  syncData: async () => {},
});

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending changes on mount and when online status changes
    checkPendingChanges();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  const checkPendingChanges = async () => {
    try {
      const pendingCount = await db.offlineFeatures
        .where('status')
        .equals('pending')
        .count();
      
      setHasPendingChanges(pendingCount > 0);
    } catch (error) {
      console.error('Error checking pending changes', error);
    }
  };

  const syncData = async () => {
    if (!isOnline) return;

    try {
      // Get all pending features
      const pendingFeatures = await db.offlineFeatures
        .where('status')
        .equals('pending')
        .toArray();

      for (const feature of pendingFeatures) {
        try {
          // Mark as syncing
          await db.offlineFeatures
            .update(feature.id!, { status: 'syncing' });

          // In a real implementation, this would send to Supabase
          // and handle photo uploads
          console.log('Syncing feature', feature.data);

          // Mark as synced and remove from queue
          await db.offlineFeatures.delete(feature.id!);
        } catch (error) {
          console.error('Error syncing feature', error);
          
          // Mark as error
          await db.offlineFeatures.update(feature.id!, { 
            status: 'error',
            errorMessage: String(error)
          });
        }
      }

      // Check if we still have pending changes
      await checkPendingChanges();
    } catch (error) {
      console.error('Error during sync', error);
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      hasPendingChanges,
      syncData,
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);

export default OfflineContext;
"@ | Out-File -FilePath "src/context/OfflineContext.tsx" -Encoding utf8

# Modify App.tsx to use our providers
Write-Host "Creating App.tsx with providers..."
@"
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { map, person, settings } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Context Providers */
import { AuthProvider } from '@/context/AuthContext';
import { MapProvider } from '@/context/MapContext';
import { OfflineProvider } from '@/context/OfflineContext';

setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <MapProvider>
      <OfflineProvider>
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/map">
                  <div>Map Page (to be implemented)</div>
                </Route>
                <Route exact path="/profile">
                  <div>Profile Page (to be implemented)</div>
                </Route>
                <Route path="/settings">
                  <div>Settings Page (to be implemented)</div>
                </Route>
                <Route exact path="/">
                  <Redirect to="/map" />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="map" href="/map">
                  <IonIcon aria-hidden="true" icon={map} />
                  <IonLabel>Map</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                  <IonIcon aria-hidden="true" icon={person} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="settings" href="/settings">
                  <IonIcon aria-hidden="true" icon={settings} />
                  <IonLabel>Settings</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      </OfflineProvider>
    </MapProvider>
  </AuthProvider>
);

export default App;
"@ | Out-File -FilePath "src/App.tsx" -Encoding utf8

# Create README.md
Write-Host "Creating README.md..."
@"
# EcoMapper

A mobile application for crowdsourced environmental and cultural mapping, built with Ionic React, Supabase, and React-Leaflet.

## Features

- Map environmental features in your local area
- Document cultural points of interest
- Report environmental issues
- Upload photos and media
- Works offline with data synchronization
- Real-time updates of nearby markers

## Getting Started

### Prerequisites

- Node.js 18.17.1 (LTS) and pnpm 8.10.0+
- Ionic CLI: \`pnpm add -g @ionic/cli@7.1.1\`
- Supabase account (for backend)
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`
3. Create a \`.env\` file based on \`.env.example\`
4. Start the development server:
   \`\`\`bash
   ionic serve
   \`\`\`

### Running on Device

#### Android
\`\`\`bash
ionic capacitor build android
\`\`\`

#### iOS
\`\`\`bash
ionic capacitor build ios
\`\`\`

## Project Structure

See \`project-structure.md\` for details on the project organization.

## Contributing

See \`development-guide.md\` for development guidelines and best practices.
"@ | Out-File -FilePath "README.md" -Encoding utf8

# Create .env file from example
Copy-Item -Path ".env.example" -Destination ".env"

# Return to the original directory
Set-Location -Path ..

Write-Host "Project setup complete! 🎉"
Write-Host "Next steps:"
Write-Host "1. cd ecomapper"
Write-Host "2. Configure the .env file with your Supabase credentials"
Write-Host "3. Run 'pnpm install'"
Write-Host "4. Run 'ionic serve' to start development"