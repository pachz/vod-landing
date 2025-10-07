import type { Metadata } from 'next'
import { Inter, Almarai } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const almarai = Almarai({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai' 
})

export const metadata: Metadata = {
  title: 'Reham Diva',
  description: 'Motivational micro-courses platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const preferred = cookieStore.get('preferred-locale')?.value
  const locale = preferred === 'en' ? 'en' : 'ar'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${almarai.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
