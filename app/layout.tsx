import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DirectionProvider } from '@/providers/DirectionProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'vod lady - Find Your Strength, Shape Your Future',
  description: 'Unlimited motivational classes in bite-sized episodes designed for women who want to grow.',
  keywords: 'motivation, women empowerment, personal growth, online courses, self-improvement',
  authors: [{ name: 'vod lady' }],
  openGraph: {
    title: 'vod lady - Find Your Strength, Shape Your Future',
    description: 'Unlimited motivational classes in bite-sized episodes designed for women who want to grow.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vod lady - Find Your Strength, Shape Your Future',
    description: 'Unlimited motivational classes in bite-sized episodes designed for women who want to grow.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DirectionProvider>
          <Navbar />
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
