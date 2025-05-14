import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} SutraPower. Todos os direitos reservados.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Sobre
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Termos
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Privacidade
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
} 