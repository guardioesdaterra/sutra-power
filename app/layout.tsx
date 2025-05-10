import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { DragonCorner } from "@/components/dragon-corner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Buddhist Sutra & AR Character Integration",
  description: "Organize and develop the integration between ancient Buddhist Sutra and 3D AR characters",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dragon-scales`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />

            {/* Decorative dragon corners - reduzidos em quantidade */}
            <DragonCorner position="bottom-right" size="small" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
