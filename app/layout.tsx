import type { Metadata } from 'next'
import { Inter, Almarai } from 'next/font/google'
import './globals.css'
import { DirectionProvider } from '@/providers/DirectionProvider'
import Navbar from '@/components/Navbar'
import HtmlAttributes from '@/components/HtmlAttributes'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const almarai = Almarai({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai' 
})

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
    <html lang="en">
      <body className={`${inter.variable} ${almarai.variable} font-sans antialiased`}>
        <HtmlAttributes />
        <DirectionProvider>
          <Navbar />
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
