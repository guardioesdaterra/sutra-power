import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
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
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex">
            <MainNav />
            <main className={`flex-1 flex flex-col`}>
              <div className="flex-1 p-4 md:p-6">
                {children}
              </div>
              <SiteFooter />
            </main>
          </div>
          <AppInitializer />
        </ThemeProvider>
      </body>
    </html>
  )
}
