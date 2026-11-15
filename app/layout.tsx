import type { Metadata } from "next"
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google"
import SiteHeader from "@/components/SiteHeader"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Minimal Blog",
    template: "%s — Minimal Blog",
  },
  description: "Notes on code, books, and business.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plexMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
