import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Atucha II — Nuclear Power Plant Visualization",
  description: "Interactive 3D visualization of the Atucha II nuclear power plant with cinematic mode and XR support",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-body ${ibmPlexSans.variable} ${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
