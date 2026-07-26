import type { Metadata } from 'next'
import { Inter, Almarai } from 'next/font/google'
import './globals.css'
import { cookies, headers } from 'next/headers'
import { AnalyticsProvider } from '@/providers/PostHogProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager'
import { getSiteUrl } from '@/lib/server/siteUrl'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const almarai = Almarai({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap'
})

export async function generateMetadata(): Promise<Metadata> {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()])
  const fromHeader = headersList.get('x-next-locale')
  const fromCookie = cookieStore.get('preferred-locale')?.value
  const locale = fromHeader === 'en' || fromHeader === 'ar'
    ? fromHeader
    : fromCookie === 'en'
      ? 'en'
      : 'ar'

  const description = locale === 'ar'
    ? 'استردي توازن حياتك بأن باتصالك بطاقتك الأنثوية، وتعودي إلى عمق حبك لذاتك وترفعي من ثقتك في ذاتك'
    : 'Restore balance in your life by connecting with your feminine energy, return to the depth of your self-love, and elevate your self-confidence'

  return {
    metadataBase: new URL(getSiteUrl()),
    title: 'Reham Diva',
    description,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()])
  const fromHeader = headersList.get('x-next-locale')
  const fromCookie = cookieStore.get('preferred-locale')?.value
  const locale = fromHeader === 'en' || fromHeader === 'ar'
    ? fromHeader
    : fromCookie === 'en'
      ? 'en'
      : 'ar'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preload" as="image" href="/images/hero.png" />
        <link rel="preload" as="video" href="/images/hero/hero.mp4" />
      </head>
      <body className={`${inter.variable} ${almarai.variable} font-sans antialiased`}>
        <GoogleTagManager />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Analytics />
        <SpeedInsights sampleRate={0.1} />
      </body>
    </html>
  )
}
