import type { Metadata } from 'next'
import { Almarai } from 'next/font/google'
import '../globals.css'
import { DirectionProvider } from '@/providers/DirectionProvider'
import Navbar from '@/components/Navbar'

const almarai = Almarai({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai' 
})

export const metadata: Metadata = {
  title: 'vod lady - اكتشفي قوتك، شكلي مستقبلك',
  description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
  keywords: 'تحفيز, تمكين المرأة, النمو الشخصي, دورات أونلاين, تطوير الذات',
  authors: [{ name: 'vod lady' }],
  openGraph: {
    title: 'vod lady - اكتشفي قوتك، شكلي مستقبلك',
    description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vod lady - اكتشفي قوتك، شكلي مستقبلك',
    description: 'دورات تحفيزية غير محدودة في حلقات قصيرة مصممة للنساء اللواتي يردن النمو.',
  },
}

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DirectionProvider initialLocale="ar">
      {children}
    </DirectionProvider>
  )
}
