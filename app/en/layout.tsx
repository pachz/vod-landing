import { DirectionProvider } from '@/providers/DirectionProvider'

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DirectionProvider initialLocale="en">
      {children}
    </DirectionProvider>
  )
}
