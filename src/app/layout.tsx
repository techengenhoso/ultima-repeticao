import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { AuthGuard } from "@/components/auth-guard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import "./globals.css"

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Última Repetição",
  description: "Acompanhe seus treinos de musculação e sua evolução",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={cn("h-full", "antialiased", "font-sans", robotoSans.variable)}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <AuthGuard>{children}</AuthGuard>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
