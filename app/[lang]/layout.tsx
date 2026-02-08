import { DirectionProvider } from '@/providers/DirectionProvider'
import { Navbar } from '@/components/layout'
import HtmlAttributes from '@/components/common/HtmlAttributes'

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const initialLocale = lang === 'en' ? 'en' : 'ar'
  return (
    <DirectionProvider initialLocale={initialLocale}>
      <HtmlAttributes />
      <Navbar />
      {children}
    </DirectionProvider>
  )
}


