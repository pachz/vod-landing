import { DirectionProvider } from '@/providers/DirectionProvider'
import { Navbar } from '@/components/layout'
import HtmlAttributes from '@/components/common/HtmlAttributes'

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: 'en' | 'ar' }
}) {
  const initialLocale = params.lang === 'en' ? 'en' : 'ar'
  return (
    <DirectionProvider initialLocale={initialLocale}>
      <HtmlAttributes />
      <Navbar />
      {children}
    </DirectionProvider>
  )
}


