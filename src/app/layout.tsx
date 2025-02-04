import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { BottomNav } from '@/components/ui/bottom-nav'
import { FloatingActionButton } from '@/components/ui/floating-action-button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mes Recettes',
  description: 'Application de gestion de recettes de cuisine',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} min-h-full bg-gray-50`}>
        <main className="container mx-auto px-4 py-8 pb-24 max-w-md">
          {children}
        </main>
        <FloatingActionButton />
        <BottomNav />
      </body>
    </html>
  )
}
