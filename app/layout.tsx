import type { Metadata } from 'next'
import { Inter, Almarai } from 'next/font/google'
import './globals.css'
import { DirectionProvider } from '@/providers/DirectionProvider'
import { Navbar } from '@/components/layout'
import { HtmlAttributes } from '@/components/common'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const almarai = Almarai({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai' 
})

export const metadata: Metadata = {
  title: 'Reham Diva - اكتشفي قوتك، شكلي مستقبلك',
  description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
  keywords: 'تحفيز, تمكين المرأة, النمو الشخصي, دورات أونلاين, تطوير الذات',
  authors: [{ name: 'Reham Diva' }],
  openGraph: {
    title: 'Reham Diva - اكتشفي قوتك، شكلي مستقبلك',
    description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reham Diva - اكتشفي قوتك، شكلي مستقبلك',
    description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${almarai.variable} font-sans antialiased`}>
        <DirectionProvider initialLocale="ar">
          <HtmlAttributes />
          <Navbar />
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
