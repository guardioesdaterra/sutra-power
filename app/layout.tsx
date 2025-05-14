import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { AppInitializer } from "@/lib/app-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SutraPower - Visualizador de Caracteres do Sutra",
  description:
    "Aplicação para visualizar e explorar os 54 caracteres do Sutra Gandavyuha.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <div className="px-4 md:px-6 bg-muted/5 border-b border-muted/20">
              <header className="container flex h-14 justify-between max-w-screen-2xl items-center">
                <MainNav />
                <Badge variant="outline" className="rounded-md px-2 py-1">v0.1.0</Badge>
              </header>
            </div>
            <div className="flex-1">
              {children}
            </div>
            <SiteFooter />
          </div>
          <AppInitializer />
        </ThemeProvider>
      </body>
    </html>
  )
}
